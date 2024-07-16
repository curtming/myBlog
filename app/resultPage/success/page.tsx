'use client'
import ResultComponent from '../../components/result/page'
import { useRouter } from 'next/navigation'
export default function Success() {
  const router = useRouter()

  const buttonLists = [
    {
      key: 'toHomePage',
      type: 'primary',
      clickHandler: () => {
        console.log('toHomePage')
        router.push('/')
      }
    }
  ]
  return (
    <div className='flex min-h-screen flex-col items-center'>
      <ResultComponent
        status={'success'}
        title={'Successfully publish an article.'}
        buttons={buttonLists}
      />
    </div>
  )
}
