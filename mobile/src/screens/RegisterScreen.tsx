import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { registerUser } from '../services/auth';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Register'> };

export default function RegisterScreen({ navigation }: Props) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone_number: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleRegister() {
    const { first_name, last_name, email, username, phone_number, password } = form;
    if (!first_name || !last_name || !email || !username || !phone_number || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      Alert.alert('Sucesso!', 'Conta criada com sucesso. Faça login para continuar.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join('\n')
        : 'Erro ao criar conta. Tente novamente.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  function Field({ fieldKey, label, placeholder, keyboard, secure, autoCapitalize }: {
    fieldKey: keyof typeof form;
    label: string;
    placeholder: string;
    keyboard?: any;
    secure?: boolean;
    autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  }) {
    const isPassword = fieldKey === 'password';
    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={isPassword ? styles.passwordRow : undefined}>
          <TextInput
            style={[
              styles.input,
              isPassword && styles.passwordInput,
              focusedField === fieldKey && styles.inputFocused,
            ]}
            value={form[fieldKey]}
            onChangeText={(v) => update(fieldKey, v)}
            placeholder={placeholder}
            placeholderTextColor="#b0b8d4"
            keyboardType={keyboard || 'default'}
            secureTextEntry={isPassword && !showPassword}
            autoCapitalize={autoCapitalize ?? 'none'}
            onFocus={() => setFocusedField(fieldKey)}
            onBlur={() => setFocusedField(null)}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              <Text style={styles.logoEmoji}>🍽️</Text>
            </View>
            <Text style={styles.brand}>VYU Restaurantes</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Criar conta</Text>
            <Text style={styles.cardSub}>Preencha seus dados para começar</Text>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={[styles.input, focusedField === 'first_name' && styles.inputFocused]}
                  value={form.first_name}
                  onChangeText={(v) => update('first_name', v)}
                  placeholder="João"
                  placeholderTextColor="#b0b8d4"
                  autoCapitalize="words"
                  onFocus={() => setFocusedField('first_name')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>Sobrenome</Text>
                <TextInput
                  style={[styles.input, focusedField === 'last_name' && styles.inputFocused]}
                  value={form.last_name}
                  onChangeText={(v) => update('last_name', v)}
                  placeholder="Silva"
                  placeholderTextColor="#b0b8d4"
                  autoCapitalize="words"
                  onFocus={() => setFocusedField('last_name')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <Field fieldKey="email" label="E-mail" placeholder="joao@email.com" keyboard="email-address" />
            <Field fieldKey="username" label="Usuário" placeholder="joaosilva" />
            <Field fieldKey="phone_number" label="Telefone" placeholder="(11) 99999-9999" keyboard="phone-pad" />
            <Field fieldKey="password" label="Senha" placeholder="••••••••" secure />

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Criar conta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginBtn} activeOpacity={0.8}>
              <Text style={styles.loginBtnText}>Já tenho uma conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const PRIMARY = '#1a237e';
const ACCENT = '#3f51b5';

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: PRIMARY },
  container: { flexGrow: 1, padding: 24 },

  hero: { alignItems: 'center', paddingTop: 40, paddingBottom: 28 },
  logoWrap: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: { fontSize: 36 },
  brand: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 32,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: PRIMARY, marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#6b7280', marginBottom: 24 },

  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  inputFocused: { borderColor: ACCENT, backgroundColor: '#fff' },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeBtn: { position: 'absolute', right: 14, top: 13 },
  eyeText: { fontSize: 18 },

  btn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.6, shadowOpacity: 0 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { marginHorizontal: 12, color: '#9ca3af', fontSize: 13 },

  loginBtn: {
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginBtnText: { color: ACCENT, fontWeight: '700', fontSize: 15 },
});
