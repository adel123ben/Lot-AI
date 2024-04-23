"use client";


import * as z from 'zod'
import { formSchema } from './constans';
import axios from "axios";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import ReactMarkdown from 'react-markdown'




import { Heading } from '@/components/heading'
import { Code } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { useProModal } from '@/hooks/use-pro-modal';
import toast from 'react-hot-toast';


const  CodePage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
        },
    });

    const loading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
          const usrMessage: ChatCompletionMessageParam = {
            role: 'user',
            content: values.prompt,
          }
          const newMessages = [...messages, usrMessage];
          const response = await axios.post('/api/code', {
            messages: newMessages,
          });
          setMessages((current) => [...current, usrMessage, response.data]);
          form.reset();
        }catch(error: any){
          if(error?.response?.status === 403){
            proModal.onOpen();
        }else{
            console.log("[CODE-ERROR]", error)
            toast.error("Something went wrong. Please try again later.");
        }
        }finally{
            router.refresh();
        }
    }






    function renderMessageContent(content: ChatCompletionMessageParam['content']): string {
      if (typeof content === 'string') {
        return content; // Markdown ou texte simple
      } else if (Array.isArray(content)) {
        // Concaténer les parties de texte pour former un seul Markdown
        return content.map(part => {
          if ('text' in part) {
            return part.text; // Assumer que c'est déjà du texte approprié
          }
          return ''; // Ou gérer d'autres types de contenu si nécessaire
        }).join(''); // Joindre les parties en une seule chaîne
      } else {
        return 'Content unavailable';
      }
    }
  return (
    <div>
      <Heading
      title='Code Generator'
      description='Generate code using descriptive text.'
      icon={Code}
      iconColor='text-green-700'
      bgColor='bg-green-700/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField  name='prompt' render={({field}) => (
                    <FormItem className='col-span-12 lg:col-span-10'>
                        <FormControl className='m-0 p-0'>
                            <Input {...field} disabled={loading} className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' placeholder='Simple toggle button using CSS and JavaScript.' />
                        </FormControl>
                        <FormMessage className='m-0 p-0' />
                    </FormItem>
                )} />
                <Button  className='col-span-12 lg:col-span-2 w-full' disabled={loading}>Send</Button>
            </form>
          </Form>
        </div>
        <div className='mt-4 space-y-4'>
          {loading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
              <Loader />
            </div>
          )}
          {messages.length === 0 && !loading && (
            <Empty label='Start a conversation 🙋‍♂️' />
          )}
          <div className='flex flex-col-reverse gap-y-4'>
          {messages.map((message, index) => (
        <div className={cn("p-8 flex w-full items-start gap-x-8 rounded-lg", message.role === 'user' ? "bg-white border border-black/10" : "bg-muted")} key={index}>
          {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
          <ReactMarkdown components={{
            pre: ({node, ...props}) => (
              <div className='w-full overflow-auto my-2 bg-black/10 p-2 rounded-lg'>
                <pre {...props} />
              </div>
            ),
            code: ({node, ...props}) => (
              <code className='bg-black/10 rounded-lg p-1'  {...props}/>
            )
          }}
          className="text-sm overflow-hidden leading-7"
          >
      {renderMessageContent(message.content || "")}
    </ReactMarkdown>
    </div>
  ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodePage
