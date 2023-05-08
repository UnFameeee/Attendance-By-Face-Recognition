import { Avatar } from "@chakra-ui/react";
import React from "react";
import ModalImage from "react-modal-image";
import onErrorImage from "../assets/onErrorImage.jpg";
function AvatarWithPreview(props) {
  const { src, alt, className, altBoxSide, altSize } = props;
  const handleOnError = (e) => {
    e.target.src = onErrorImage;
  };
  if (src && !src.includes("null")) {
    return (
      <ModalImage
        className={`object-cover rounded-full ${className}`}
        small={src}
        large={src}
        alt={alt}
        showRotate={true}
        onError={handleOnError}
      />
    );
  } else {
    return <Avatar alt={alt} boxSize={altBoxSide} size={altSize} />;
  }
}

export default AvatarWithPreview;
