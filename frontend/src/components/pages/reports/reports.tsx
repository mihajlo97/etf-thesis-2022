export const Reports = () => {
  return (
    <>
      <div className="uk-overflow-auto">
        <table className="uk-table uk-table-divider uk-table-middle">
          <thead>
            <tr>
              <th>{'Timestamp'}</th>
              <th>{'Name'}</th>
              <th>{'Model'}</th>
              <th>{'Class'}</th>
              <th>{'Confidence'}</th>
              <th>{'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <tr key={item}>
                <td>{new Date().toLocaleString()}</td>
                <td>{'Report ' + item}</td>
                <td>{'MobileNetV' + ((item % 2) + 1)}</td>
                <td>{'meow'}</td>
                <td>{'21.64%'}</td>
                <td>
                  <button className="uk-button uk-button-default uk-width-1-1 uk-button-small">{'Open'}</button>
                  <button className="uk-button uk-button-danger uk-width-1-1 uk-button-small uk-margin-small-top">
                    {'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
