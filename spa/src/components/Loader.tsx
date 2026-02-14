import './Loader.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const Loader = ({ size = 'medium', fullScreen = false }: LoaderProps) => {
  const loaderClass = `loader loader--${size}`;

  if (fullScreen) {
    return (
      <div className="loader-container loader-container--fullscreen">
        <div className={loaderClass}>
          <div className="loader__spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className={loaderClass}>
        <div className="loader__spinner"></div>
      </div>
    </div>
  );
};

export default Loader;
