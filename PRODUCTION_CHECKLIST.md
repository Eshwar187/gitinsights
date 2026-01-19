# Production Checklist

## Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] GitHub OAuth app configured for production URLs
- [ ] Razorpay account in live mode
- [ ] SSL certificates obtained
- [ ] Domain DNS configured

## Security
- [ ] JWT secrets are strong (32+ chars)
- [ ] Encryption keys generated
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection enabled
- [ ] No sensitive data in logs

## Performance
- [ ] Gzip compression enabled
- [ ] Static asset caching configured
- [ ] Database indexes created
- [ ] Connection pooling enabled
- [ ] CDN configured (optional)
- [ ] Image optimization done

## Monitoring
- [ ] Error tracking setup (Sentry recommended)
- [ ] Uptime monitoring configured
- [ ] Log aggregation setup
- [ ] Health check endpoints working
- [ ] Alerts configured for critical errors

## Testing
- [ ] Authentication flow tested
- [ ] GitHub OAuth tested
- [ ] Payment flow tested (Razorpay)
- [ ] All API endpoints tested
- [ ] WebSocket connection tested
- [ ] Error scenarios tested
- [ ] Load testing completed

## Deployment
- [ ] Frontend built successfully
- [ ] Backend running in production mode
- [ ] Database accessible
- [ ] Redis running (if used)
- [ ] WebSocket connections work
- [ ] CORS configured correctly
- [ ] All URLs point to production

## Post-Deployment
- [ ] Verify login works
- [ ] Test GitHub sync
- [ ] Test subscription flow
- [ ] Check error logging
- [ ] Monitor performance metrics
- [ ] Setup automated backups
- [ ] Document rollback procedure

## Maintenance
- [ ] Automated backups scheduled
- [ ] Update schedule planned
- [ ] Security patches process defined
- [ ] Monitoring dashboard accessible
- [ ] Support channels established
