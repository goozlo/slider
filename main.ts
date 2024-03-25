interface IOptions {
	loop: boolean
	initial: string | number
}

const DEFAULT_OPTIONS: IOptions = { loop: true, initial: 0 }

/** @description Отвечает за изменения активного индекса */
class Kernel {
	private _index: number
	private slides: string[]
	private options: IOptions

	constructor(slides: string[], options: Partial<IOptions> = {}) {
		this.slides = slides
		this.options = { ...DEFAULT_OPTIONS, ...options }
		this.slideTo(this.options.initial)
	}

	public get index() {
		return this._index
	}

	public slideTo(idex: string | number) {
		const isIndex = typeof idex === 'number'

		if (isIndex) {
			if (0 <= idex && idex < this.slides.length) {
				this._index = idex
				return
			}

			this._index = 0
		}

		for (let i = 0; i < this.slides.length; i++) {
			const slide = this.slides[i]

			if (slide === idex) {
				this._index = i
				break
			}
		}
	}

	public slideForward() {
		const lastIndex = this.slides.length - 1

		if (this.index === lastIndex && this.options.loop) {
			this._index = 0
			return
		}

		this._index = Math.min(this.index + 1, lastIndex)
	}

	public slideBackward() {
		if (!this.index && this.options.loop) {
			this._index = this.slides.length - 1
			return
		}

		this._index = Math.max(this.index - 1, 0)
	}
}

const db = [
	{
		id: '1',
		text: "We're thrilled to welcome you to our Annual Tech Expo, where innovation meets opportunity. This year, we've curated an exceptional lineup of speakers, showcasing the latest trends and technologies in the industry. Join us as we explore the future of tech and its impact on businesses and society."
	},
	{
		id: '2',
		text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis temporibus alias velit modi et explicabo, at id! Odit cum sunt, commodi eos, temporibus earum repudiandae aperiam ad minus atque esse?'
	},
	{
		id: '3',
		text: 'Improved cardiovascular health Enhanced mood and mental well-being Increased energy levels Better sleep quality Weight management and muscle tone Reduced risk of chronic diseases'
	},
	{
		id: '4',
		text: 'This sets a promising foundation for the upcoming quarters. Keep up the great work! Let me know if you need further assistance with anything else!'
	},
	{ id: '5', text: 'quality Weight management and muscle tone Reduced risk' }
]

const list = document.getElementById('root') as HTMLUListElement

const items = db.map(({ text }, index) => {
	const item = document.createElement('li')
	const paragrpaph = document.createElement('p')
	const img = document.createElement('img')

	img.setAttribute('src', `/assets/image-${((index + 1) % 3) + 1}.png`)

	paragrpaph.textContent = text

	item.append(img, paragrpaph)

	return item
})

list.append(...items)

const kernel = new Kernel(db.map(slide => slide.id))

const animate = () => {
	// biome-ignore lint/complexity/noForEach: <explanation>
	items.forEach(item => item.classList.remove('slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5'))
	// items.forEach(item => item.classList.remove('[class^="slide-"]'))

	for (let i = 0; i < 5; i++) {
		const className = `slide-${i + 1}`
		let slideIndex = kernel.index - (i - 2)

		if (slideIndex < 0) {
			slideIndex += db.length
		}

		if (slideIndex > db.length - 1) {
			slideIndex -= db.length
		}

		items[slideIndex].classList.add(className)
	}
}

animate()

const btnLeft = document.getElementById('slideLeftBtn') as HTMLButtonElement
const btnRight = document.getElementById('slideRightBtn') as HTMLButtonElement

btnLeft.onclick = () => {
	kernel.slideBackward()
	animate()
}

btnRight.onclick = () => {
	kernel.slideForward()
	animate()
}
