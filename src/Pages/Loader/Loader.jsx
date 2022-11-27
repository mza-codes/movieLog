import './Loader.css';

const Loader = ({ page }) => (
    <>
        <div className={page ? "loaderParentPage" : "loaderParent"}>
            <h2 className='movieLog'>movieLog</h2>
            <div className="loaderContainer">
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
            </div>
            <h4 className='gradient-text'>Loading Content</h4>
            <span className='gradient-text'> © {new Date().getFullYear()} mza-codes</span>
        </div>
    </>
);

export default Loader;