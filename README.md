# Photobooth

Requirements:
- Node (Tested v8.11.3)
- libgphoto2 (brew install libgphoto2, apt-get install libgphoto2-dev  or download and build from http://www.gphoto.org/proj/libgphoto2/)
- angular-cli
- electron

*For r-pi: follow [link](https://medium.com/@cgulabrani/controlling-your-dslr-through-raspberry-pi-ad4896f5e225) to build libgphoto2 from source

Build:
- Install dependencies `npm install`
- Build `ng build` for production `ng build --prod`
- Run `npm run electron`
