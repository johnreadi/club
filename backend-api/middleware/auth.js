const jwt = require('jsonwebtoken');

exports.verifierToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erreur: 'Accès non autorisé' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch {
    return res.status(401).json({ erreur: 'Token invalide ou expiré' });
  }
};

exports.estAdminPlateforme = (req, res, next) => {
  if (req.utilisateur.role !== 'admin_plateforme') {
    return res.status(403).json({ erreur: 'Droits insuffisants' });
  }
  next();
};
