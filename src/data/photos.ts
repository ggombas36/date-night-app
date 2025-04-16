import { Photo } from '../components/Photo';

// Import your photos or use URLs
import photo1 from '../assets/photos/OG1.png';
import photo2 from '../assets/photos/OG2.png';
// import photo3 from '../assets/photos/OG3.png';
import photo4 from '../assets/photos/OG4.png';
// import photo5 from '../assets/photos/OG5.png';
// import photo6 from '../assets/photos/OG6.png';
// import photo7 from '../assets/photos/OG7.png';
// Add more imports as needed

export const photos: Photo[] = [
  {
    id: '1',
    path: photo1,
    title: 'First Photo Shoot',
    date: '2022.06'
  },
  // {
  //   id: '2',
  //   path: photo6,
  //   title: 'Second Photo Shoot',
  //   date: '2023.06'
  // },
  // {
  //   id: '3',
  //   path: photo5,
  //   title: 'Park Güell, Barcelona, Spain',
  //   date: '2023.11.18.'
  // },
  // {
  //   id: '4',
  //   path: photo3,
  //   title: 'Chefchauen, Morocco',
  //   date: '2024.03.21.'
  // },
  {
    id: '5',
    path: photo2,
    title: 'Albufeira Beach, Algarve, Portugal',
    date: '2024.05.12.'
  },
  // {
  //   id: '6',
  //   path: photo7,
  //   title: 'Our Graduation, Győr, Hungary',
  //   date: '2025.02.22.'
  // },
  {
    id: '7',
    path: photo4,
    title: 'Cherry Blossom Adventure Date',
    date: '2025.04.04.'
  },
  // Add more photos as needed
];