# This is the default target, which will be built when 
# you invoke make
.PHONY: all
all: build-front build-back package

# This rule tells make how to build hello from hello.cpp
build-front: 
		cd frontend && npm run build

build-back: 
		cd backend && npm run build

package:
		mkdir -p build
		cp -r backend/dist build/dist
		cp backend/package.json build
		cp backend/package-lock.json build
		cp -r frontend/build build/web
		cd build && zip -r release.zip .
		cp build/release.zip .
		rm -r build