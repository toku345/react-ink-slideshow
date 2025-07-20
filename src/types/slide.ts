export interface BaseSlide {
  type?: 'title' | 'content'
}

export interface TitleSlideData extends BaseSlide {
  type: 'title'
  title: string
  subtitle?: string
  author?: string
}

export interface ContentSlideData extends BaseSlide {
  type?: 'content'
  title?: string
  content: string
}

export type SlideData = TitleSlideData | ContentSlideData
