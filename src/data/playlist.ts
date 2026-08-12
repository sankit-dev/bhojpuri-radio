import backgroundCover from '../assets/background.png'

export interface Song {
  id: string
  title: string
  artist: string
  src: string
  cover: string
  year?: number
  movie?: string
}

export const playlist: Song[] = [
  {
    id: 'lollipop-lagelu',
    title: 'Lollipop Lagelu',
    artist: 'Pawan Singh',
    src: '/audio/lollipop-lagelu.mp3',
    cover: backgroundCover,
  },
  {
    id: 'nirahua-rickshawala',
    title: 'Nirahua Rickshawala',
    artist: 'Dinesh Lal Yadav',
    src: '/audio/nirahua-rickshawala.mp3',
    cover: backgroundCover,
  },
]
