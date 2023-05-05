import { Avatar } from "@chakra-ui/react";
import React from "react";
import ModalImage from "react-modal-image";
function AvatarWithPreview(props) {
  const { src, alt, className, altBoxSide, altSize} = props;
  if (src && !src.includes("null")) {
    return (
      <ModalImage
        className={`object-cover rounded-full ${className}`}
        small={src}
        large={src}
        alt={alt}
        showRotate={true}
      />
    );
  } else {
    return <Avatar alt={alt} boxSize={altBoxSide}  size={altSize} />;
  }
}

export default AvatarWithPreview;
