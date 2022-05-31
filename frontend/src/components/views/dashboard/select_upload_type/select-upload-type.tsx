/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  DashboardView,
  SwitchDashboardView,
} from "../../../../consts/dashboard.consts";
import { storeUploadedImage } from "../../../../service/dashboard.service";

export interface SelectUploadTypeProps {
  transition: SwitchDashboardView;
}

export const SelectUploadType = ({ transition }: SelectUploadTypeProps) => {
  const handleImageUpload = (ev: any) => {
    storeUploadedImage(false, ev.target.files[0]);
    transition(DashboardView.SETTINGS);
  };

  const openWebcam = () => {
    transition(DashboardView.WEBCAM);
  };

  return (
    <div>
      <h4 style={{ textAlign: "center" }}>{"Choose upload type"}</h4>

      <div className="js-upload uk-padding-small" data-uk-form-custom>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button className="uk-button uk-button-primary uk-width-1-1">
          {"Upload image"}
        </button>
      </div>

      <div className="uk-padding-small">
        <button
          className="uk-button uk-button-secondary uk-width-1-1"
          onClick={openWebcam}
        >
          {"Take picture"}
        </button>
      </div>
    </div>
  );
};
