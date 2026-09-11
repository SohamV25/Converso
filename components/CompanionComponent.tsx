'use client';

import {useEffect, useRef, useState} from 'react'
import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import {addToSessionHistory} from "@/lib/actions/companion.actions";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if(lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage= { role: message.role, content: message.transcript}
                setMessages((prev) => [newMessage, ...prev])
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        }

        // @ts-expect-error Vapi types do not accept assistantOverrides as a second argument
        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    const statusLabel = {
        [CallStatus.INACTIVE]: 'Ready when you are',
        [CallStatus.CONNECTING]: 'Connecting…',
        [CallStatus.ACTIVE]: isSpeaking ? `${name.split(' ')[0]} is speaking` : 'Listening',
        [CallStatus.FINISHED]: 'Session ended',
    }[callStatus]

    return (
        <section className="flex min-h-[70vh] flex-col">
            <section className="flex gap-6 max-sm:flex-col">
                <div className="companion-section">
                    {/* Subject-colour glow behind the avatar */}
                    <div
                        aria-hidden
                        className={cn('pointer-events-none absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] transition-opacity duration-700', callStatus === CallStatus.ACTIVE ? 'opacity-45' : 'opacity-20')}
                        style={{ backgroundColor: getSubjectColor(subject) }}
                    />
                    <div aria-hidden className="graph-paper pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle,black,transparent_70%)]" />

                    <div className="companion-avatar shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <div
                            className={
                            cn(
                                'absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0', callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )
                        }>
                            <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className="max-sm:w-fit" />
                        </div>

                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0')}>
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie"
                            />
                        </div>
                    </div>

                    <div className="relative flex flex-col items-center gap-2">
                        <p className="font-display text-3xl font-semibold">{name}</p>
                        <p className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase" aria-live="polite">
                            <span className={cn('size-2 rounded-full', callStatus === CallStatus.ACTIVE ? 'animate-pulse bg-primary' : callStatus === CallStatus.CONNECTING ? 'animate-pulse bg-mustard' : 'bg-muted-foreground/50')} />
                            {statusLabel}
                        </p>
                    </div>
                </div>

                <div className="user-section">
                    <div className="user-avatar">
                        <Image src={userImage} alt={userName} width={120} height={120} className="rounded-3xl ring-4 ring-surface-2" />
                        <p className="font-display text-2xl font-semibold">
                            {userName}
                        </p>
                    </div>
                    <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE} aria-pressed={isMuted}>
                        <span className={cn('flex size-12 items-center justify-center rounded-full', isMuted ? 'bg-destructive/15 text-destructive' : 'bg-surface-2 text-foreground')}>
                            {isMuted ? <MicOff className="size-5" aria-hidden /> : <Mic className="size-5" aria-hidden />}
                        </span>
                        <p className="text-sm font-medium max-sm:hidden">
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </p>
                    </button>
                    <button
                        className={cn('flex w-full items-center justify-center gap-2 rounded-[22px] py-4 font-semibold transition-colors duration-200', callStatus === CallStatus.ACTIVE ? 'bg-destructive text-cream hover:bg-destructive/85' : 'bg-primary text-primary-foreground hover:bg-[#6ae8c2]', callStatus === CallStatus.CONNECTING && 'animate-pulse')}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
                        {callStatus === CallStatus.ACTIVE ? <PhoneOff className="size-4" aria-hidden /> : <Phone className="size-4" aria-hidden />}
                        {callStatus === CallStatus.ACTIVE
                        ? "End session"
                        : callStatus === CallStatus.CONNECTING
                            ? 'Connecting'
                        : 'Start session'
                        }
                    </button>
                </div>
            </section>

            <section className="transcript" aria-label="Transcript">
                {messages.length === 0 && (
                    <p className="font-display text-xl text-muted-foreground/70">
                        {callStatus === CallStatus.ACTIVE ? 'Say hello — your transcript will appear here.' : 'Start a session and the conversation will be transcribed here.'}
                    </p>
                )}
                <div className="transcript-message no-scrollbar">
                    {messages.map((message, index) => {
                        if(message.role === 'assistant') {
                            return (
                                <p key={index} className="max-sm:text-base">
                                    <span className="text-mustard">
                                    {
                                        name
                                            .split(' ')[0]
                                            .replace(/[.,]/g, '')
                                    }:</span> {message.content}
                                </p>
                            )
                        } else {
                           return <p key={index} className="text-muted-foreground max-sm:text-base">
                                <span className="text-primary">{userName}:</span> {message.content}
                            </p>
                        }
                    })}
                </div>

                <div className="transcript-fade" />
            </section>
        </section>
    )
}

export default CompanionComponent
