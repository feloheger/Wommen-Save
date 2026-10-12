/**
 * Vertrauenspersonen – hinzufügen, bearbeiten, favorisieren, anrufen, löschen
 */
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ChevronRight, MoreHorizontal, Phone, PhoneCall, Plus, Star, X } from "lucide-react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import { MAX_CONTACTS } from "@/constants";
import { useContactsStore } from "@/store/contactsStore";
import { Colors, Fonts, Radius } from "@/theme";
import type { TrustedContact } from "@/types";
import { getInitial, makeId } from "@/utils/formatters";
import { contactSchema } from "@/utils/validation";

export const ContactsScreen: React.FC = () => {
  const { contacts, addContact, updateContact, removeContact, toggleFavorite } = useContactsStore();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<TrustedContact | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const openForm = (contact: TrustedContact | null) => {
    if (!contact && contacts.length >= MAX_CONTACTS) {
      Alert.alert(
        "Limit erreicht",
        `Du kannst bis zu ${MAX_CONTACTS} Vertrauenspersonen speichern.`,
      );
      return;
    }
    setEditing(contact);
    setName(contact?.name ?? "");
    setPhone(contact?.phone ?? "");
    setErrors({});
    setVisible(true);
  };

  const save = () => {
    const parsed = contactSchema.safeParse({ name, phone });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({ name: fieldErrors.name?.[0], phone: fieldErrors.phone?.[0] });
      return;
    }
    if (editing) {
      updateContact(editing.id, parsed.data);
    } else {
      addContact({ id: makeId(), ...parsed.data, isFavorite: false });
    }
    setVisible(false);
  };

  const openMenu = (c: TrustedContact) => {
    Alert.alert(c.name, undefined, [
      { text: "Bearbeiten", onPress: () => openForm(c) },
      {
        text: c.isFavorite ? "Favorit entfernen" : "Als Favorit (Notfall-Priorität)",
        onPress: () => toggleFavorite(c.id),
      },
      {
        text: "Löschen",
        style: "destructive",
        onPress: () =>
          Alert.alert(
            `${c.name} entfernen?`,
            "Diese Person wird im Notfall nicht mehr informiert.",
            [
              { text: "Abbrechen", style: "cancel" },
              { text: "Entfernen", style: "destructive", onPress: () => removeContact(c.id) },
            ],
          ),
      },
      { text: "Abbrechen", style: "cancel" },
    ]);
  };

  return (
    <Screen title="Vertrauenspersonen">
      <Pressable
        onPress={() => openForm(null)}
        accessibilityRole="button"
        accessibilityLabel="Vertrauensperson hinzufügen"
        style={({ pressed }) => [pressed && { opacity: 0.85 }]}
      >
        <Card style={styles.addCard}>
          <Plus size={20} color={Colors.primary} />
          <Text style={styles.addText}>Vertrauensperson hinzufügen</Text>
        </Card>
      </Pressable>

      {contacts.length === 0 && (
        <Text style={styles.empty}>
          Noch keine Vertrauenspersonen. Sie erhalten im Notfall deinen Standort per SMS.
        </Text>
      )}

      {contacts.map((c) => (
        <Card key={c.id} style={styles.contact}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial(c.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {c.name}{" "}
              {c.isFavorite ? (
                <Star size={12} color={Colors.warning} fill={Colors.warning} />
              ) : null}
            </Text>
            <Text style={styles.sub}>{c.relationship ?? "Vertrauensperson"}</Text>
          </View>
          <Pressable
            onPress={() => Linking.openURL(`tel:${c.phone}`)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`${c.name} anrufen`}
            style={styles.action}
          >
            <Phone size={20} color={Colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => openMenu(c)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Mehr Optionen für ${c.name}`}
            style={styles.action}
          >
            <MoreHorizontal size={20} color={Colors.textMuted} />
          </Pressable>
        </Card>
      ))}

      <View style={{ height: 8 }} />
      <ListRow
        icon={<PhoneCall size={20} color={Colors.white} />}
        title="Notfallkontakte"
        subtitle="Für den Ernstfall"
        onPress={() => router.push("/emergency-numbers")}
        right={<ChevronRight size={18} color={Colors.textMuted} />}
      />

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.backdrop}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {editing ? "Person bearbeiten" : "Vertrauensperson hinzufügen"}
              </Text>
              <Pressable
                onPress={() => setVisible(false)}
                hitSlop={12}
                accessibilityLabel="Schließen"
              >
                <X size={22} color={Colors.text} />
              </Pressable>
            </View>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
            />
            <Input
              label="Telefonnummer"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+49 151 2345678"
              error={errors.phone}
            />
            <Button label="Speichern" onPress={save} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    marginBottom: 14,
  },
  addText: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },
  empty: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    marginVertical: 20,
  },
  contact: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.white },
  name: { fontFamily: Fonts.medium, fontSize: 14.5, color: Colors.text },
  sub: { fontFamily: Fonts.regular, fontSize: 11.5, color: Colors.textMuted },
  action: { paddingHorizontal: 8, paddingVertical: 4 },
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: Colors.overlay },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: 22,
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: { fontFamily: Fonts.semibold, fontSize: 17, color: Colors.text },
});
