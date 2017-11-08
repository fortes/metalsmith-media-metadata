/* eslint-env node,jest */
const {promisify} = require('util');

const readdir = promisify(require('fs').readdir);
const mediaMetadata = require('./index');
const Metalsmith = require('metalsmith');
const path = require('path');
const rimraf = promisify(require('rimraf'));

let files;
let metal;

beforeAll(done => {
  // Setup metalsmith, but don't build yet.
  metal = Metalsmith(__dirname)
    .source('./')
    .ignore([
      '*.js',
      '.*',
      '__*',
      'coverage',
      'node_modules',
      'package.json',
      'yarn.lock',
    ])
    .destination('__build')
    .use((files, metalsmith, done) => {
      // Stale cache file, will get ignored and replaced
      files['test-mpeg_512kb.mp4.exifcache.json'] = {
        contents: new Buffer(JSON.stringify({fake: 'fake'})),
        stats: {
          mtime: new Date('1900-01-01'),
        },
      };

      // Valid cache data
      files['sample2.jpg.exifcache.json'] = {
        contents: new Buffer(JSON.stringify({cachedData: 'valid'})),
        stats: {
          mtime: new Date(),
        },
      };

      setImmediate(done);

      // Valid
    })
    .use(mediaMetadata({cache: true}));

  metal.build((err, processedFiles) => {
    files = processedFiles;
    done(err);
  });
});

afterAll(() => {
  return Promise.all([
    rimraf(path.join(__dirname, '__build')),
    rimraf(path.join(__dirname, '*.exifcache.json')),
  ]);
});

it('test fixture builds', () => {
  // If build pipeline fails, `files` never gets assigned
  expect(files).toBeDefined();
});

it('adds exif data to images', () => {
  const data = files['sample.jpg'];
  // Exiftool output varies slightly by version, etc. Pick just a few fields to
  // check on.
  expect(data.exif).toBeDefined();
  expect(data.exif.ImageWidth).toBe(640);
  expect(data.exif.Flash).toBe('Off, Did not fire');
});

it('uses valid cache', () => {
  const data = files['sample2.jpg'];
  expect(data.exif).toBeDefined();
  // expect(data.exif).toEqual({cachedData: 'valid'});
});

it('ignores stale cache', () => {
  const data = files['test-mpeg_512kb.mp4'];
  expect(data.exif).toBeDefined();
  expect(data.exif.TrackDuration).toBe('21.00 s');
  expect(data.exif.AudioChannels).toBe(2);
});

it('ignores non-media files', () => {
  expect(files['README.md']).toBeDefined();
  expect(files['README.md'].exif).toBeUndefined();
});

it('writes cache files to disk', () => {
  return readdir(__dirname).then(files => {
    const cacheFiles = files.filter(file => /\.exifcache.json$/.test(file));
    // Cache for sample2 will not be there, since we faked it.
    expect(cacheFiles).toMatchSnapshot();
  });
});
