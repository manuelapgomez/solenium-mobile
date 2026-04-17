import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AudioEvidenceScreen() {
    const router = useRouter();
    const { title, targetQuantity, unit } = useLocalSearchParams();
    
    // States
    const [amount, setAmount] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [hasAudio, setHasAudio] = useState(false);
    const [timer, setTimer] = useState(0);
    const [recordScale] = useState(new Animated.Value(1));

    // Handle timer
    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            setHasAudio(true);
            Animated.timing(recordScale, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        } else {
            setHasAudio(false);
            setTimer(0);
            setIsRecording(true);
            Animated.loop(
                Animated.sequence([
                    Animated.timing(recordScale, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                    Animated.timing(recordScale, { toValue: 1, duration: 800, useNativeDriver: true })
                ])
            ).start();
        }
    };

    const handleDelete = () => {
        setHasAudio(false);
        setTimer(0);
        setIsRecording(false);
    };

    const handleFinish = () => {
        // Full process finished, go back to absolute home
        router.replace('/' as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Feather name="chevron-left" size={28} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles y Progreso</Text>
                <TouchableOpacity onPress={handleFinish} style={styles.headerActionBtn}>
                    <Text style={styles.headerSkipText}>{hasAudio ? '' : 'Omitir'}</Text>
                </TouchableOpacity>
            </View>

            {/* Content Body */}
            <ScrollView 
                style={styles.content} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                
                {/* Visual Context */}
                <View style={styles.contextBox}>
                    <Text style={styles.contextTitle}>{title || 'Evidencia de Tarea'}</Text>
                    
                    <Text style={styles.progressCardTitle}>¿CUÁNTOS {unit ? String(unit).toUpperCase() : 'ÍTEMS'} AVANZASTE HOY?</Text>
                    
                    {/* QUANTITATIVE STEPPER */}
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity 
                            style={styles.stepperBtnBtn} 
                            onPress={() => {
                                const current = parseInt(amount || '0');
                                if (current > 0) setAmount((current - 1).toString());
                            }}
                        >
                            <Feather name="minus" size={24} color={Colors.textPrimary} />
                        </TouchableOpacity>
                        
                        <View style={styles.stepperInputWrapper}>
                            <Text style={styles.stepperInputDummy}>{amount || '0'}</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.stepperBtnBtn} 
                            onPress={() => {
                                const current = parseInt(amount || '0');
                                setAmount((current + 1).toString());
                            }}
                        >
                            <Feather name="plus" size={24} color={Colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                    {targetQuantity && (
                        <Text style={styles.stepperHint}>De los {targetQuantity} pendientes</Text>
                    )}

                    <Text style={styles.contextSubtitle}>
                        (Opcional) Agrega una nota de voz como contexto sobre novedades o retrasos.
                    </Text>
                </View>

                {/* Microphone Area */}
                <View style={styles.micZone}>
                    <Text style={[styles.timerText, isRecording && styles.timerActive]}>
                        {formatTime(timer)}
                    </Text>
                    
                    <TouchableOpacity activeOpacity={0.8} onPress={toggleRecording}>
                        <Animated.View style={[
                            styles.micOuterCircle, 
                            isRecording && styles.micOuterRecording,
                            { transform: [{ scale: recordScale }] }
                        ]}>
                            <View style={[styles.micInnerCircle, isRecording && styles.micInnerRecording]}>
                                <Feather name={isRecording ? "square" : "mic"} size={40} color={Colors.paper} />
                            </View>
                        </Animated.View>
                    </TouchableOpacity>

                    <Text style={styles.statusHint}>
                        {isRecording ? 'Grabando... Toca el centro para detener' : (hasAudio ? '¡Nota de voz guardada!' : 'Toca el centro para empezar a grabar')}
                    </Text>
                </View>

                {/* Player Tools (only visible when audio is recorded and stopped) */}
                <View style={[styles.playerTools, !hasAudio && styles.invisible]}>
                    <TouchableOpacity style={styles.playerBtn}>
                        <Feather name="play" size={20} color={Colors.textPrimary} />
                        <Text style={styles.playerBtnText}>Reproducir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.playerBtnDanger} onPress={handleDelete}>
                        <Feather name="trash-2" size={20} color={Colors.error} />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Bottom Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.finishBtn, !amount && styles.finishBtnDisabled]} onPress={handleFinish} disabled={!amount}>
                    <Text style={styles.finishBtnText}>Guardar Evidencia Total</Text>
                    <Feather name="check-circle" size={20} color={Colors.paper} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        height: 50,
        backgroundColor: Colors.paper,
    },
    iconBtn: {
        padding: 8,
        marginLeft: -8,
        width: 60,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    headerActionBtn: {
        paddingVertical: 8,
        width: 60,
        alignItems: 'flex-end',
    },
    headerSkipText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6B7280', // muted skip link
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        alignItems: 'center',
        padding: Spacing.xl,
        paddingBottom: Spacing.xxl * 2,
    },
    contextBox: {
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacing.xxl * 1.5,
        marginTop: Spacing.xl,
    },
    contextTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    contextSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.xl,
    },
    progressCardTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.textSecondary,
        marginBottom: Spacing.xl,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    stepperBtnBtn: {
        width: 56,
        height: 56,
        borderRadius: Radii.full,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.sm,
    },
    stepperInputWrapper: {
        paddingHorizontal: Spacing.xxl,
    },
    stepperInputDummy: {
        fontSize: 48,
        fontWeight: '800',
        color: Colors.primary,
        fontVariant: ['tabular-nums'],
    },
    stepperHint: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    micZone: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Spacing.xl,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '300',
        color: Colors.textSecondary,
        marginBottom: Spacing.xxl,
        fontVariant: ['tabular-nums'],
        letterSpacing: 2,
    },
    timerActive: {
        color: Colors.error,
        fontWeight: '600',
        textShadowColor: 'rgba(239, 68, 68, 0.2)',
        textShadowRadius: 10,
    },
    micOuterCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    micOuterRecording: {
        backgroundColor: '#FEE2E2', // light red
    },
    micInnerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.lg,
    },
    micInnerRecording: {
        backgroundColor: Colors.error,
    },
    statusHint: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textMuted,
        marginTop: Spacing.lg,
    },
    invisible: {
        opacity: 0,
    },
    playerTools: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xl,
        gap: Spacing.md,
    },
    playerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: Radii.full,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    playerBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginLeft: 8,
    },
    playerBtnDanger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    footer: {
        padding: Spacing.xl,
        paddingBottom: Spacing.xxl,
        backgroundColor: Colors.paper,
    },
    finishBtn: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.textPrimary,
        borderRadius: Radii.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.md,
    },
    finishBtnDisabled: {
        backgroundColor: Colors.textMuted,
        opacity: 0.2, // disabled until they pick a percentage
    },
    finishBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.paper,
        marginRight: 8,
    }
});
