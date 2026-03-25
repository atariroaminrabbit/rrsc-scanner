import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useAttendees } from '../../src/context/AttendeeContext';
import { Attendee } from '../../src/services/attendees';

type ScanMode = 'qr' | 'manual';
type ResultType = 'valid-first' | 'valid-reentry' | 'not-found' | 'prompt-manual';

interface ScanResult {
  type: ResultType;
  attendee?: Attendee;
  scannedId?: string;
}

function ResultCard({
  result,
  onScanNext,
  onTryManual,
}: {
  result: ScanResult;
  onScanNext: () => void;
  onTryManual: () => void;
}) {
  const isValid = result.type === 'valid-first' || result.type === 'valid-reentry';
  const isPromptManual = result.type === 'prompt-manual';

  const bgColor = isValid ? '#16A34A' : '#DC2626';
  const icon = isValid ? 'checkmark-circle' : 'close-circle';

  const title = {
    'valid-first': 'Checked In',
    'valid-reentry': 'Re-Entry Logged',
    'not-found': 'Not Registered',
    'prompt-manual': 'QR Unreadable',
  }[result.type];

  const subtitle = {
    'valid-first': `Welcome, ${result.attendee?.name}`,
    'valid-reentry': `${result.attendee?.name} — Entry #${result.attendee?.checkInCount}`,
    'not-found': 'This ID is not on the attendee list.',
    'prompt-manual': 'Ask the attendee for their registration ID.',
  }[result.type];

  return (
    <View style={[styles.resultCard, { backgroundColor: bgColor }]}>
      <Ionicons name={icon as any} size={48} color="#fff" style={styles.resultIcon} />
      <Text style={styles.resultTitle}>{title}</Text>
      <Text style={styles.resultSubtitle}>{subtitle}</Text>
      {result.attendee && (
        <Text style={styles.resultRegId}>{result.attendee.registrationId}</Text>
      )}

      <View style={styles.resultActions}>
        {(result.type === 'not-found' || isPromptManual) && (
          <TouchableOpacity style={styles.manualButton} onPress={onTryManual} activeOpacity={0.8}>
            <Text style={styles.manualButtonText}>Try Manual Entry</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={onScanNext} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>
            {isValid ? 'Scan Next' : 'Dismiss'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ScanScreen() {
  const { attendees, checkIn } = useAttendees();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanMode>('qr');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualId, setManualId] = useState('');
  const [processing, setProcessing] = useState(false);
  const scanCooldown = useRef(false);

  const validate = (rawId: string): ScanResult => {
    const id = rawId.trim().toUpperCase();
    const existing = attendees.find((a) => a.registrationId.toUpperCase() === id);
    if (!existing) return { type: 'not-found', scannedId: id };

    const updated = checkIn(id);
    if (!updated) return { type: 'not-found', scannedId: id };

    return {
      type: updated.checkInCount === 1 ? 'valid-first' : 'valid-reentry',
      attendee: updated,
    };
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanCooldown.current || processing || result) return;
    scanCooldown.current = true;

    if (!data || data.trim() === '') {
      setResult({ type: 'prompt-manual' });
      return;
    }

    setProcessing(true);
    // Slight delay to simulate API call (Phase 7: replace with real call)
    setTimeout(() => {
      setResult(validate(data));
      setProcessing(false);
    }, 300);
  };

  const handleManualSubmit = () => {
    if (!manualId.trim() || processing) return;
    Keyboard.dismiss();
    setProcessing(true);
    setTimeout(() => {
      setResult(validate(manualId));
      setProcessing(false);
      setManualId('');
    }, 300);
  };

  const handleScanNext = () => {
    setResult(null);
    scanCooldown.current = false;
  };

  const handleTryManual = () => {
    setResult(null);
    scanCooldown.current = false;
    setMode('manual');
  };

  // Request camera permission on mount if needed
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#111827" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mode toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'qr' && styles.modeButtonActive]}
          onPress={() => { setMode('qr'); setResult(null); scanCooldown.current = false; }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="qr-code-outline"
            size={16}
            color={mode === 'qr' ? '#fff' : '#6B7280'}
          />
          <Text style={[styles.modeButtonText, mode === 'qr' && styles.modeButtonTextActive]}>
            QR Scanner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'manual' && styles.modeButtonActive]}
          onPress={() => { setMode('manual'); setResult(null); scanCooldown.current = false; }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="keypad-outline"
            size={16}
            color={mode === 'manual' ? '#fff' : '#6B7280'}
          />
          <Text style={[styles.modeButtonText, mode === 'manual' && styles.modeButtonTextActive]}>
            Manual Entry
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera / Manual view */}
      {mode === 'qr' ? (
        <View style={styles.cameraContainer}>
          {!permission.granted ? (
            <View style={styles.centered}>
              <Ionicons name="camera-off-outline" size={48} color="#9CA3AF" />
              <Text style={styles.permissionText}>Camera access is required to scan QR codes.</Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={result ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              />
              {/* Viewfinder overlay */}
              <View style={styles.overlay}>
                <View style={styles.viewfinder}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                </View>
                <Text style={styles.scanHint}>Point at the attendee's QR code</Text>
              </View>
              {processing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator color="#fff" size="large" />
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <View style={styles.manualContainer}>
          <Ionicons name="id-card-outline" size={48} color="#D1D5DB" style={styles.manualIcon} />
          <Text style={styles.manualLabel}>Enter Registration ID</Text>
          <Text style={styles.manualHint}>Type the ID shown in the attendee's app</Text>
          <TextInput
            style={styles.manualInput}
            placeholder="e.g. RRSC-2026-001"
            placeholderTextColor="#9CA3AF"
            value={manualId}
            onChangeText={(t) => setManualId(t.toUpperCase())}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleManualSubmit}
            editable={!processing}
          />
          <TouchableOpacity
            style={[styles.submitButton, (!manualId.trim() || processing) && styles.submitButtonDisabled]}
            onPress={handleManualSubmit}
            disabled={!manualId.trim() || processing}
            activeOpacity={0.8}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Check In</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Result overlay */}
      {result && (
        <View style={styles.resultOverlay}>
          <ResultCard
            result={result}
            onScanNext={handleScanNext}
            onTryManual={handleTryManual}
          />
        </View>
      )}
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;
const CORNER_COLOR = '#fff';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    margin: 16,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#111827',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  modeButtonTextActive: {
    color: '#fff',
  },

  // Camera
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: 220,
    height: 220,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  scanHint: {
    color: '#fff',
    fontSize: 13,
    marginTop: 24,
    opacity: 0.8,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Manual entry
  manualContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 48,
  },
  manualIcon: {
    marginBottom: 12,
  },
  manualLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  manualHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  manualInput: {
    width: '100%',
    height: 52,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#111827',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Result
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  resultCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  resultIcon: {
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  resultSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultRegId: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
    fontWeight: '600',
  },
  resultActions: {
    width: '100%',
    gap: 10,
  },
  manualButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Permissions
  permissionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  permissionButton: {
    height: 44,
    paddingHorizontal: 24,
    backgroundColor: '#111827',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
