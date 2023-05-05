import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import Header from '@/layouts/header'
import { useRouter } from 'next/router'
import Dashboard from '@/components/Dashboard'
import CheckAuth from '@/components/checkAuth.js'
import NewLayout from '../../NewLayout'
import TableComponent from '../../NewComponents/tableComponent'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [loading,setLoading] = useState(true)
  const router = useRouter()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token) {
     router.push('/dang-nhap')
    } else {
      setLoading(false)
    }
   },[])


  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-logo.png" />
      </Head>
      <main className={cn(styles.main)}>
        {loading && <CheckAuth/>}
        <NewLayout>
          Home
        </NewLayout>
      </main>
    </>
  ) 
}

