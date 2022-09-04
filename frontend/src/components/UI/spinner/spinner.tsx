/* eslint-disable jsx-a11y/alt-text */

export interface SpinnerProps {
  hide?: boolean;
}

export const Spinner = ({ hide }: SpinnerProps) => {
  return (
    <>
      <img src={`${process.env.PUBLIC_URL}/assets/spinner.svg`} className={hide ? 'hide' : ''} />
    </>
  );
};
