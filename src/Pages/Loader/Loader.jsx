import './Loader.css';

const Loader = ({ page }) => (
    <>
        <div className={page ? "loaderParentPage" : "loaderParent"}>
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
            <h4>Loading ...</h4>
        </div>
    </>
);

export default Loader;