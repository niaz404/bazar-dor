// BetterAuth Client Adapter

export const authClient = {
  updateUser: async ({ name, image }) => {
    // Adapter matching BetterAuth updateUser API spec
    try {
      const savedUser = localStorage.getItem('bazardor_auth_user');
      if (!savedUser) throw new Error('Unauthorized');
      const user = JSON.parse(savedUser);
      const updated = { ...user, name: name || user.name, image: image || user.image };
      localStorage.setItem('bazardor_auth_user', JSON.stringify(updated));
      return { data: updated, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
  getSession: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('bazardor_auth_user');
    return user ? JSON.parse(user) : null;
  }
};
