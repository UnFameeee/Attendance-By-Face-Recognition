import {
  Box,
  Center,
  Icon,
  Button,
  Text,
  Flex,
  Heading,
} from "@chakra-ui/react";
import {
  AiOutlineWarning,
  AiFillCloseCircle,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import React from "react";
import ImageUploading from "react-images-uploading";

function ImagesUploading({
  images,
  onChange,
  maxNumber,
  isDisabled,
  noDescription,
  ...props
}) {
  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
        errors,
      }) => (
        <>
          {errors && (
            <div>
              {errors.maxNumber && (
                <Flex alignItems="center" gap="5px">
                  <Icon
                    color="secondary1"
                    boxSize="25px"
                    as={AiOutlineWarning}
                  />
                  <Text
                    fontSize="1.3rem"
                    fontWeight="medium"
                    color="secondary1"
                  >
                    The maximum number of selected images is {maxNumber}
                  </Text>
                </Flex>
              )}
              {errors.acceptType && (
                <Flex alignItems="center" gap="5px">
                  <Icon
                    color="secondary1"
                    boxSize="25px"
                    as={AiOutlineWarning}
                  />
                  <Text
                    fontSize="1.3rem"
                    fontWeight="medium"
                    color="secondary1"
                  >
                    Your selected file type is not allow
                  </Text>
                </Flex>
              )}
              {errors.maxFileSize && (
                <Flex alignItems="center" gap="5px">
                  <Icon
                    color="secondary1"
                    boxSize="25px"
                    as={AiOutlineWarning}
                  />
                  <Text
                    fontSize="1.3rem"
                    fontWeight="medium"
                    color="secondary1"
                  >
                    Selected file size exceed maxFileSize
                  </Text>
                </Flex>
              )}
              {errors.resolution && (
                <Flex alignItems="center" gap="5px">
                  <Icon
                    color="secondary1"
                    boxSize="25px"
                    as={AiOutlineWarning}
                  />
                  <Text
                    fontSize="1.3rem"
                    fontWeight="medium"
                    color="secondary1"
                  >
                    Selected file is not match your desired resolution
                  </Text>
                </Flex>
              )}
            </div>
          )}
          {isDisabled ? (
            <Center
              width="100%"
              cursor="not-allowed"
              boxSizing="border-box"
              rounded="lg"
              border={"2px dashed #999"}
              height="100%"
            >
              <Heading fontWeight="medium">
                You don't have permission to upload
              </Heading>
            </Center>
          ) : (
            <Center
              width="100%"
              cursor="pointer"
              boxSizing="border-box"
              rounded="lg"
              border={imageList.length > 0 ? "none" : "2px dashed #999"}
              height="100%"
              position="relative"
              onClick={onImageUpload}
              {...dragProps}
            >
              <Button colorScheme="blue" zIndex='5' pos="absolute" top="0" left="0">
                Upload
              </Button>
              <Box
                position="absolute"
                inset="0"
                display={imageList.length > 0 ? "none" : "flex"}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Center>
                  <Icon
                    _hover={{ color: "primary1" }}
                    boxSize={20}
                    color="#999"
                    as={AiOutlineCloudUpload}
                  />
                </Center>
                {!noDescription && (
                  <Center>
                    <Text color="#4374e3" mr={1}>
                      Click to upload
                    </Text>
                    <Text>or drag and drop</Text>
                  </Center>
                )}
                {!noDescription && (
                  <Center display="flex" flexDirection="column">
                    <Text>SVG, PNG, JPEG or GIF</Text>
                  </Center>
                )}
              </Box>
              <Box display="flex" w="100%" h="100%" gap="5px">
                {imageList.map((image, index) => (
                  <Box
                    border="1px solid gray"
                    rounded="lg"
                    pos="relative"
                    flex="1"
                    backgroundImage={image["data_url"]}
                    backgroundSize="contain"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center"
                    key={index}
                    className="image-item"
                  >
                    <Box
                      pos="absolute"
                      className="image-item__btn-wrapper"
                      right="0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageRemove(index);
                      }}
                    >
                      <Icon
                        color="secondary1"
                        boxSize="40px"
                        as={AiFillCloseCircle}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Center>
          )}
        </>
      )}
    </ImageUploading>
  );
}

export default ImagesUploading;
