// Dark mode: `colorScheme` on <html> follows the OS until the reader picks a
// side; the choice lives in `data-theme` on <html> and in localStorage. This
// script runs in <head> before the first paint and restores a stored choice,
// so the page never flashes the wrong theme. The toggle (theme-toggle.tsx)
// writes both.

export const THEME_STORAGE_KEY = 'theme';

export const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
