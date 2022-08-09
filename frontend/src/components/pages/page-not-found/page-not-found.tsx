import { Footer } from '../../layout/footer/footer';

export const PageNotFound = () => {
  return (
    <>
      <div className="uk-alert-danger uk-alert uk-margin-xlarge-top" uk-alert>
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h3>{'Error 404: Page Not Found'}</h3>
          <p>{'The page you have requested does not exist or has been moved to a different URL.'}</p>
        </div>
      </div>

      <Footer />
    </>
  );
};
