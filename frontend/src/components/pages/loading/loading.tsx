import { Footer } from '../../layout/footer/footer';
import { Header } from '../../layout/header/header';
import { Spinner } from '../../UI/spinner/spinner';

export const Loading = () => {
  return (
    <>
      <Header />
      <div className="uk-flex uk-flex-row uk-flex-center uk-margin-large-top">
        <div className="uk-card uk-width-1-2@m">
          <div className="uk-flex uk-flex-row uk-flex-center">
            <Spinner />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
