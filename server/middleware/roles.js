// Role-based access control middleware.
// Usage:  router.get('/admin-only', authorize('admin'), handler)
//         router.get('/drivers-and-admin', authorize('driver','admin'), handler)

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This endpoint requires one of: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
}

// Convenience shortcuts
export const clientOnly  = authorize('client');
export const driverOnly  = authorize('driver');
export const adminOnly   = authorize('admin');
export const driverOrAdmin = authorize('driver', 'admin');
export const anyRole     = authorize('client', 'driver', 'admin');
