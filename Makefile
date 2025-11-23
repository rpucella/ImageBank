
build:
	# Build frontend.
	npm run build
	cp dist-ui/index.html resources/
	cp -R dist-ui/assets resources/
	# Build Neutralinojs app.
	npm run neutralino-build
	rm -f dist/imagebank/server
	ln -s $(PWD)/server/ dist/imagebank

install:
	npm install

clean-neutralino:
	rm -rf dist
	rm -rf dist-ui

clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf dist-ui
