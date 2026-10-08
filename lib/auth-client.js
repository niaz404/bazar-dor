export const authClient = {
  updateUser: async ({ name, image }) => {
    try {
      const savedUser = localStorage.getItem('bazardor_user');
      if (!savedUser) throw new Error('Unauthorized');
      const user = JSON.parse(savedUser);
      const updated = { ...user, name: name || user.name, image: image || user.image };
      localStorage.setItem('bazardor_user', JSON.stringify(updated));
      return { data: updated, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
  getSession: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('bazardor_user');
    return user ? JSON.parse(user) : null;
  }
};
