import Image, { ImageProps } from 'next/image';

interface CustomImageProps extends Partial<ImageProps> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width = 0, 
  height = 0, 
  sizes = "100vw",
  ...rest 
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      style={{ width: '100%', height: 'auto' }}
      {...rest} 
    />
  );
};

export default CustomImage;
