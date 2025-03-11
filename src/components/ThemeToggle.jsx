const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle; 