import ContentLoader from "react-content-loader";

const Loader = (props) => (
  <ContentLoader
    speed={2}
    width={320}
    height={440}
    viewBox="0 0 320 440"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="10" ry="10" width="300" height="300" />
    <rect x="3" y="321" rx="0" ry="0" width="297" height="36" />
    <rect x="8" y="378" rx="0" ry="0" width="292" height="91" />
  </ContentLoader>
);

export default Loader;
