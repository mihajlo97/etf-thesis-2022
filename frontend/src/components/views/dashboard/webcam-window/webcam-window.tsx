/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Webcam from "react-webcam";
import {
  DashboardView,
  DEFAULT_WEBCAM_CONSTRAINTS,
  SwitchDashboardView,
} from "../../../../consts/dashboard.consts";
import { VideoConstraints } from "../../../../model/dashboard.model";
import {
  getUploadedImageURL,
  storeUploadedImage,
} from "../../../../service/dashboard.service";
import { Spinner } from "../../../UI/spinner/spinner";

export interface WebcamProps {
  transition: SwitchDashboardView;
}

export const WebcamWindow = ({ transition }: WebcamProps) => {
  const [allowWebcam, setAllowWebcam] = React.useState(false);
  const [imageTaken, setImageTaken] = React.useState(false);
  const [width, setWidth] = React.useState(DEFAULT_WEBCAM_CONSTRAINTS.width);
  const [height, setHeight] = React.useState(DEFAULT_WEBCAM_CONSTRAINTS.height);
  const webcamRef = React.useRef(null);

  const getVideoConstraints = (): VideoConstraints => ({
    width,
    height,
    facingMode: DEFAULT_WEBCAM_CONSTRAINTS.facingMode,
  });

  const captureImage = React.useCallback(() => {
    const source = webcamRef.current as any;

    storeUploadedImage(
      true,
      source.getScreenshot({
        width,
        height,
      })
    );
    setImageTaken(true);
  }, [webcamRef]);

  const retakeImage = () => setImageTaken(false);

  const checkIsWebcamAllowed = () => {
    const permissions = window.navigator as any;

    permissions.getUserMedia(
      {
        video: true,
        audio: false,
      },
      (localMediaStream: any) => {
        setAllowWebcam(true);
      },
      (err: any) => {
        setAllowWebcam(false);
      }
    );
  };

  const submitImage = () => {
    transition(DashboardView.SETTINGS);
  };

  React.useEffect(() => {
    checkIsWebcamAllowed();
  }, []);

  return (
    <div>
      <h4 style={{ textAlign: "center" }}>{"Upload via camera"}</h4>

      {!allowWebcam ? (
        <div>
          <p style={{ textAlign: "center" }}>
            {`Please allow this website to access the camera in order to view the camera feed.`}
          </p>
          <div className="uk-flex uk-flex-center">
            <Spinner />
          </div>
        </div>
      ) : null}

      <div>
        {!imageTaken ? (
          <Webcam
            audio={false}
            mirrored={true}
            width={width}
            height={height}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={getVideoConstraints()}
          />
        ) : (
          <img src={getUploadedImageURL()} />
        )}
      </div>

      {allowWebcam ? (
        <div className="uk-flex uk-flex-center">
          {!imageTaken ? (
            <button
              className="uk-button uk-button-primary uk-width-1-1"
              onClick={captureImage}
            >
              {"Capture"}
            </button>
          ) : (
            <button
              className="uk-button uk-button-default uk-width-1-1"
              onClick={retakeImage}
            >
              {"Retake"}
            </button>
          )}
        </div>
      ) : null}

      {imageTaken ? (
        <div className="uk-flex uk-flex-center uk-margin-top">
          <button className="uk-button uk-button-primary" onClick={submitImage}>
            {"Submit"}
          </button>
        </div>
      ) : null}
    </div>
  );
};
