const path = require('path')
const url = require('url')
const axios = require('axios')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow

let isDev = false
const isMac = process.plateform === 'darwin' ? true : false

if (
	process.env.NODE_ENV !== undefined &&
	process.env.NODE_ENV === 'development'
) {
	isDev = true
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: isDev ? 1400 : 1100,
		height: 800,
		show: false,
		backgroundColor: 'white',
		icon: './assets/icons/icon.png',
		webPreferences: {
			nodeIntegration: true,
		},
	})

	let indexPath

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

	mainWindow.loadURL(indexPath)

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()

		// Open devtools if dev
		if (isDev) {
			const {
				default: installExtension,
				REACT_DEVELOPER_TOOLS,
			} = require('electron-devtools-installer')

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
				console.log('Error loading React DevTools: ', err)
			)
			mainWindow.webContents.openDevTools()
		}
	})

	mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createMainWindow)

function filtered(data) {
	const allowed = ['NCV', 'Price']
	const res = Object.keys(data)
		.filter((key) => allowed.includes(key))
		.reduce((obj, key) => {
			obj[key] = data[key]
			return obj
		}, {})
	return res
}

ipcMain.on('nation:fetch', (e, data) => {
	console.log('coming form nation:fetch : receiving the data ==> \n', data)
	const configNation = {
		method: 'post',
		url: 'https://apidev.nationex.com/api/ShippingV2/GetPrice',
		headers: {
			Authorization: 'AISDJA6I6OCUY6ELG3GFRRSUXHRJV',
			'Content-Type': 'application/json',
		},
		data: data,
	}
	axios(configNation)
		.then((response) => {
			console.log(response.data)
			return sendNationBack(filtered(response.data))
		})
		.catch((error) => console.log(error))
})

ipcMain.on('canpar:fetch', (e, data) => {
	const configCanpar = {
		method: 'post',
		url: 'https://sandbox.canpar.com/canshipws/services/CanparRatingService',
		headers: {
			'content-type': 'application/soap+xml',
		},
		data: data,
	}

	axios(configCanpar)
		.then((response) => {
			// TODO parse it here before sending the response
			sendCanparBack(response.data)
		})
		.catch((error) => {
			console.log(error)
		})
})

async function sendNationBack(response) {
	try {
		mainWindow.webContents.send('nation:response', JSON.stringify(response))
	} catch (err) {
		console.log(err)
	}
}

async function sendCanparBack(response) {
	try {
		mainWindow.webContents.send('canpar:response', response)
	} catch (err) {
		console.log(err)
	}
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow()
	}
})

// Stop error
app.allowRendererProcessReuse = true
