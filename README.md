# metalsmith-media-metadata

[![build status](https://travis-ci.org/fortes/metalsmith-media-metadata.svg?branch=master)](https://travis-ci.org/fortes/metalsmith-media-metadata) [![codecov](https://codecov.io/gh/fortes/metalsmith-media-metadata/branch/master/graph/badge.svg)](https://codecov.io/gh/fortes/metalsmith-media-metadata) [![Greenkeeper badge](https://badges.greenkeeper.io/fortes/metalsmith-media-metadata.svg)](https://greenkeeper.io/)

Adds metadata to image and video metalsmith file objects. Only really useful when used in conjunction with other plugins.

## Example

The output of `exiftool` is added as metadata into the metalsmith file object for any media file:

```js
{
  'dog.jpg': {
    // Existing file data untouched
    exif: {
      Sharpness: 'Normal',
      SubjectDistanceRange: 'Unknown',
      GPSLatitudeRef: 'North',
      GPSLongitudeRef: 'East',
      GPSAltitudeRef: 'Above Sea Level',
      GPSTimeStamp: '14:27:07.24',
      GPSSatellites: '06',
      GPSImgDirectionRef: 'Unknown ()',
      GPSMapDatum: 'WGS-84   ',
      GPSDateStamp: '2008:10:23',
      Compression: 'JPEG (old-style)',
      ThumbnailOffset: 4560,
      ThumbnailLength: 6702,
      ImageWidth: 640,
      ImageHeight: 480,
      EncodingProcess: 'Baseline DCT, Huffman coding',
      BitsPerSample: 8,
      ColorComponents: 3,
      // Many, many fields...
    }
  }
}
```

## Usage

```js
const mediaMetadata = require('metalsmith-media-metadata');

metalsmith.use(mediaMetadata({
  // Only process jpegs
  path: '**/*.+(jpg|jpeg)'
}));
```

There are two configuration options:

* `cache`: Save exif data alongside images (default: `false`)
* `path`: [`minimatch`](https://github.com/isaacs/minimatch) *case-insensitive* glob that determines which files get processed (default: `**/*.+(gif|jpg|mp4|png)`)

## Requirements

* [`exiftool`](https://www.sno.phy.queensu.ca/~phil/exiftool/): Depending on your platform, installing [`dist-exiftool`](https://www.npmjs.com/package/dist-exiftool) may be the easiest way to go.

## Changelog

* `0.1.0`: Add cache option
* `0.0.4`: Update default search path to match subdirectories
* `0.0.3`: Fix bug where paths were not relative to `metalsmith.source()`
* `0.0.2`: Package metadata update, no changes
* `0.0.1`: Initial release

## Related plugins

* `metalsmith-image-dimensions`: Adds `width` and `height` to `img` tags.

## Miscellaneous

Sample images used in tests taken from [ianare/exif-samples](https://github.com/ianare/exif-samples)

Sample video from the [Internet Archive](https://archive.org/details/test-mpeg)
