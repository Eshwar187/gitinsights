-- Create Real-Time Collaboration system tables

-- Collaboration rooms
CREATE TABLE IF NOT EXISTS collaboration_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Room identification
  room_code VARCHAR(20) UNIQUE NOT NULL,
  room_name VARCHAR(255) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Room settings
  room_type VARCHAR(50) CHECK (room_type IN ('pair_programming', 'code_review', 'hackathon', 'interview', 'teaching', 'brainstorming')),
  is_public BOOLEAN DEFAULT false,
  max_participants INTEGER DEFAULT 10,
  password_hash VARCHAR(255),
  
  -- Technical details
  programming_language VARCHAR(50),
  repository_linked VARCHAR(500),
  
  -- Status
  room_status VARCHAR(50) DEFAULT 'active' CHECK (room_status IN ('active', 'paused', 'ended')),
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room participants  
CREATE TABLE IF NOT EXISTS room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Participant details
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'participant' CHECK (role IN ('host', 'moderator', 'participant', 'observer')),
  permissions JSONB DEFAULT '{"canEdit": true, "canChat": true, "canVideo": false, "canAudio": true}',
  cursor_color VARCHAR(7) NOT NULL, -- Hex color like #FF5733
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Time tracking
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  total_time_minutes INTEGER DEFAULT 0,
  
  UNIQUE(room_id, user_id)
);

-- Shared documents in rooms
CREATE TABLE IF NOT EXISTS collaborative_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  
  -- Document details
  document_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  content TEXT DEFAULT '',
  language VARCHAR(50),
  
  -- Versioning
  version INTEGER DEFAULT 1,
  last_edited_by UUID REFERENCES users(id),
  
  -- Locking
  is_locked BOOLEAN DEFAULT false,
  locked_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code changes log for conflict resolution
CREATE TABLE IF NOT EXISTS code_changes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES collaborative_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Change details
  change_type VARCHAR(50) CHECK (change_type IN ('insert', 'delete', 'replace')),
  start_position INTEGER NOT NULL,
  end_position INTEGER,
  old_content TEXT,
  new_content TEXT,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages in rooms
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Message details
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'code_snippet', 'system_notification', 'reaction')),
  content TEXT NOT NULL,
  code_snippet TEXT,
  code_language VARCHAR(50),
  
  -- Threading
  reply_to_message_id UUID REFERENCES chat_messages(id),
  
  -- Reactions
  reactions JSONB DEFAULT '{}', -- { "👍": ["user1-uuid"], "🎉": ["user2-uuid"] }
  
  -- Pinning
  is_pinned BOOLEAN DEFAULT false,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time cursor positions
CREATE TABLE IF NOT EXISTS cursor_positions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES collaborative_documents(id) ON DELETE CASCADE,
  
  -- Position
  line_number INTEGER NOT NULL,
  col_position INTEGER NOT NULL,
  selection_start INTEGER,
  selection_end INTEGER,
  
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (user_id, document_id)
);

-- Shared whiteboard
CREATE TABLE IF NOT EXISTS whiteboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  
  -- Element details
  element_type VARCHAR(50) CHECK (element_type IN ('rectangle', 'circle', 'line', 'arrow', 'text', 'image', 'sticky_note')),
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Element properties
  properties JSONB DEFAULT '{}', -- { color, strokeWidth, text, fontSize, rotation }
  
  -- Management
  created_by UUID NOT NULL REFERENCES users(id),
  layer_order INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice/video channels
CREATE TABLE IF NOT EXISTS voice_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  
  -- Channel details
  channel_type VARCHAR(50) CHECK (channel_type IN ('voice_only', 'video_call', 'screen_share')),
  active_participants JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Session recordings
CREATE TABLE IF NOT EXISTS room_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  
  -- Recording details
  recording_type VARCHAR(50) CHECK (recording_type IN ('code_only', 'with_audio', 'with_video')),
  file_url TEXT,
  duration_seconds INTEGER,
  file_size_mb INTEGER,
  thumbnail_url TEXT,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code execution results
CREATE TABLE IF NOT EXISTS code_execution_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  document_id UUID REFERENCES collaborative_documents(id) ON DELETE SET NULL,
  executed_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Execution details
  code_snapshot TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  output TEXT,
  errors TEXT,
  execution_time_ms INTEGER,
  exit_code INTEGER,
  
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room templates
CREATE TABLE IF NOT EXISTS room_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template details
  template_name VARCHAR(255) NOT NULL,
  description TEXT,
  suggested_participants INTEGER DEFAULT 2,
  default_files JSONB DEFAULT '[]', -- [{ filename, language, starterCode }]
  default_permissions JSONB DEFAULT '{}',
  recommended_duration_minutes INTEGER,
  
  -- Visibility
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_collaboration_rooms_code ON collaboration_rooms(room_code);
CREATE INDEX idx_collaboration_rooms_status ON collaboration_rooms(room_status);
CREATE INDEX idx_collaboration_rooms_created_by ON collaboration_rooms(created_by);

CREATE INDEX idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX idx_room_participants_user_id ON room_participants(user_id);
CREATE INDEX idx_room_participants_active ON room_participants(is_active);

CREATE INDEX idx_collaborative_documents_room_id ON collaborative_documents(room_id);
CREATE INDEX idx_code_changes_log_document_id ON code_changes_log(document_id);
CREATE INDEX idx_code_changes_log_timestamp ON code_changes_log(timestamp DESC);

CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp DESC);

CREATE INDEX idx_cursor_positions_document_id ON cursor_positions(document_id);

CREATE INDEX idx_whiteboard_data_room_id ON whiteboard_data(room_id);
CREATE INDEX idx_voice_channels_room_id ON voice_channels(room_id);
CREATE INDEX idx_room_recordings_room_id ON room_recordings(room_id);
CREATE INDEX idx_code_execution_results_room_id ON code_execution_results(room_id);

-- Create updated_at triggers
CREATE TRIGGER update_collaborative_documents_updated_at
BEFORE UPDATE ON collaborative_documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whiteboard_data_updated_at
BEFORE UPDATE ON whiteboard_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE collaboration_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_changes_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursor_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_execution_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view rooms they participate in"
  ON collaboration_rooms FOR SELECT
  USING (
    id IN (SELECT room_id FROM room_participants WHERE user_id = auth.uid())
    OR is_public = true
  );

CREATE POLICY "Users can create rooms"
  ON collaboration_rooms FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Participants can view room participants"
  ON room_participants FOR SELECT
  USING (
    room_id IN (SELECT room_id FROM room_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can access documents in their rooms"
  ON collaborative_documents FOR ALL
  USING (
    room_id IN (SELECT room_id FROM room_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view chat in their rooms"
  ON chat_messages FOR ALL
  USING (
    room_id IN (SELECT room_id FROM room_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can view public templates"
  ON room_templates FOR SELECT
  USING (is_public = true OR created_by = auth.uid());
