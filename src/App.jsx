import { useEffect } from 'react'
import { Gallery } from './components/Gallery'
import { Title } from './components/Title'

function App() {
  useEffect(() => {
    const className = 'bg-primary';
    document.body.setAttribute('class', className);
  });
  return (
    <section
    className='bg-gradient-to-tr from-primary to-[#CAD1E8] h-[100vh] w-[100vw] flex justify-center'>
      <Title/>
    </section>
  )
}

export default App
