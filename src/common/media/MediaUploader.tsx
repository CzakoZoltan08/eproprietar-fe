"use client";

import { Box, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import styled from "styled-components";

const MAX_VIDEOS = 3;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type MediaUploaderProps = {
  thumbnail: File | null;
  setThumbnail: (file: File | null) => void;
  images: File[];
  setImages: (files: File[]) => void;
  videos: File[];
  setVideos: (files: File[]) => void;
  error?: string;
  setError: (msg: string) => void;
};

const DropArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${({ $isDragging }) => ($isDragging ? "#007BFF" : "#ccc")};
  background-color: ${({ $isDragging }) => ($isDragging ? "#f0f8ff" : "transparent")};
  padding: 20px;
  text-align: center;
  width: 100%;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.3s, border-color 0.3s;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 120px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const PreviewVideo = styled.video`
  width: 100%;
  max-width: 180px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const ThumbnailWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const ThumbnailBox = styled.div`
  width: 150px;
  height: 150px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: #fafafa;
  transition: border-color 0.3s;

  &:hover {
    border-color: #007bff;
  }
`;

const ThumbnailPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaUploader: React.FC<MediaUploaderProps> = ({
  thumbnail,
  setThumbnail,
  images = [],
  setImages,
  videos = [],
  setVideos,
  error,
  setError,
}) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isDraggingVideos, setIsDraggingVideos] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreviews(images.map((file) => URL.createObjectURL(file)));
    return () => images.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
  }, [images]);

  useEffect(() => {
    setVideoPreviews(videos.map((file) => URL.createObjectURL(file)));
    return () => videos.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
  }, [videos]);

  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setThumbnailPreview(null);
    }
  }, [thumbnail]);

  const validateImages = (files: FileList | File[]) => {
    return Array.from(files).filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG or WebP images are allowed.");
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Image ${file.name} exceeds 5MB limit.`);
        return false;
      }
      return true;
    });
  };

  const validateVideos = (files: FileList | File[]) => {
    return Array.from(files).filter((file) => {
      if (!file.type.startsWith("video/")) {
        setError("Only video files are allowed.");
        return false;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        setError(`Video ${file.name} exceeds 100MB limit.`);
        return false;
      }
      return true;
    });
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width > 1920 || img.height > 1080) {
        setError("Thumbnail resolution cannot exceed 1920x1080.");
        return;
      }

      setThumbnail(file);
      setError("");
    };
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const valid = validateImages(files);
    if (images.length + valid.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    setImages([...images, ...valid]);
    setError("");
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const valid = validateVideos(files);
    if (videos.length + valid.length > MAX_VIDEOS) {
      setError(`You can upload a maximum of ${MAX_VIDEOS} videos.`);
      return;
    }

    setVideos([...videos, ...valid]);
    setError("");
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const removeVideo = (index: number) => {
    const updated = [...videos];
    updated.splice(index, 1);
    setVideos(updated);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const valid = validateImages(e.dataTransfer.files);
    if (images.length + valid.length > MAX_IMAGES) {
      setError(`Max ${MAX_IMAGES} images allowed.`);
      return;
    }

    setImages([...images, ...valid]);
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideos(false);
    const valid = validateVideos(e.dataTransfer.files);
    if (videos.length + valid.length > MAX_VIDEOS) {
      setError(`Max ${MAX_VIDEOS} videos allowed.`);
      return;
    }

    setVideos([...videos, ...valid]);
  };

  return (
    <Box width="100%" mt={4}>
      <ThumbnailWrapper>
        <Typography variant="h6">Thumbnail Image</Typography>
        <ThumbnailBox onClick={() => thumbnailInputRef.current?.click()}>
          {thumbnailPreview ? (
            <ThumbnailPreviewImage src={thumbnailPreview} />
          ) : (
            <Typography color="textSecondary">Click to upload</Typography>
          )}
        </ThumbnailBox>
        <input
          type="file"
          accept="image/*"
          ref={thumbnailInputRef}
          style={{ display: "none" }}
          onChange={handleThumbnailChange}
        />
      </ThumbnailWrapper>

      <Typography mt={4} variant="h6">
        Images
      </Typography>
      <DropArea
        $isDragging={isDraggingImages}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingImages(true);
        }}
        onDragLeave={() => setIsDraggingImages(false)}
        onDrop={handleImageDrop}
        onClick={() => imageInputRef.current?.click()}
      >
        Drag & drop images here or click to select
      </DropArea>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <PreviewContainer>
        {imagePreviews.map((src, index) => (
          <PreviewImage key={index} src={src} alt="preview" onClick={() => removeImage(index)} />
        ))}
      </PreviewContainer>

      <Typography mt={4} variant="h6">
        Videos
      </Typography>
      <DropArea
        $isDragging={isDraggingVideos}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingVideos(true);
        }}
        onDragLeave={() => setIsDraggingVideos(false)}
        onDrop={handleVideoDrop}
        onClick={() => videoInputRef.current?.click()}
      >
        Drag & drop videos here or click to select
      </DropArea>
      <input
        type="file"
        accept="video/*"
        multiple
        ref={videoInputRef}
        style={{ display: "none" }}
        onChange={handleVideoUpload}
      />
      <PreviewContainer>
        {videoPreviews.map((src, index) => (
          <PreviewVideo key={index} src={src} controls onClick={() => removeVideo(index)} />
        ))}
      </PreviewContainer>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default MediaUploader;