/**
 * Vertrauenspersonen Screen – Hinzufügen, Bearbeiten, Löschen, Favoriten
 */
import React, { useState } from "react";
import { View, Text, FlatList, Pressable, Modal } from "react-native";
import { Plus, Star, Trash2, Phone, X } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ScreenContainer } from "@components/common/ScreenContainer";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { useContactsStore } from "@store/contactsStore";
import { contactSchema, type ContactFormData } from "@utils/validation";
import { getInitials, getAvatarColor } from "@utils/formatters";
import { FREE_CONTACTS_LIMIT } from "@constants/config";
import { usePremiumStore } from "@store/premiumStore";
import type { TrustedContact } from "@types/index";

export const ContactsScreen: React.FC = () => {
  const { contacts, addContact, updateContact, removeContact, toggleFavorite } =
    useContactsStore();
  const { isPremium } = usePremiumStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const openAddModal = () => {
    setEditingContact(null);
    reset({ name: "", phone: "", relationship: "" });
    setModalVisible(true);
  };

  const openEditModal = (contact: TrustedContact) => {
    setEditingContact(contact);
    reset({ name: contact.name, phone: contact.phone, relationship: contact.relationship });
    setModalVisible(true);
  };

  const onSubmit = (data: ContactFormData) => {
    if (editingContact) {
      updateContact(editingContact.id, data);
    } else {
      addContact({
        id: Math.random().toString(36).slice(2),
        name: data.name,
        phone: data.phone,
        relationship: data.relationship,
        isFavorite: false,
        avatarColor: getAvatarColor(data.name),
      });
    }
    setModalVisible(false);
  };

  const canAddMore = isPremium || contacts.length < FREE_CONTACTS_LIMIT;

  return (
    <ScreenContainer scroll={false}>
      <View className="mt-4 mb-4 flex-row items-center justify-between">
        <Text className="font-poppins-bold text-2xl text-textPrimary">Vertrauenspersonen</Text>
        <Pressable
          onPress={canAddMore ? openAddModal : () => {}}
          className="h-11 w-11 items-center justify-center rounded-full bg-primary"
        >
          <Plus size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {!canAddMore && (
        <Text className="mb-4 font-poppins text-xs text-textSecondary">
          Kostenloses Limit erreicht ({FREE_CONTACTS_LIMIT}). Mit Premium unbegrenzt hinzufügen.
        </Text>
      )}

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="mt-10 text-center font-poppins text-sm text-textSecondary">
            Noch keine Vertrauenspersonen hinzugefügt.
          </Text>
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <View className="flex-row items-center justify-between">
              <Pressable
                className="flex-1 flex-row items-center"
                onPress={() => openEditModal(item)}
              >
                <View
                  className="mr-3 h-11 w-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.avatarColor }}
                >
                  <Text className="font-poppins-semibold text-sm text-white">
                    {getInitials(item.name)}
                  </Text>
                </View>
                <View>
                  <Text className="font-poppins-semibold text-sm text-textPrimary">
                    {item.name}
                  </Text>
                  <View className="mt-1 flex-row items-center">
                    <Phone size={12} color="#6B6B85" />
                    <Text className="ml-1 font-poppins text-xs text-textSecondary">
                      {item.phone}
                    </Text>
                  </View>
                </View>
              </Pressable>

              <View className="flex-row items-center">
                <Pressable onPress={() => toggleFavorite(item.id)} className="mr-3 p-1">
                  <Star
                    size={20}
                    color={item.isFavorite ? "#FFB020" : "#D6D0EE"}
                    fill={item.isFavorite ? "#FFB020" : "transparent"}
                  />
                </Pressable>
                <Pressable onPress={() => removeContact(item.id)} className="p-1">
                  <Trash2 size={20} color="#FF4D6A" />
                </Pressable>
              </View>
            </View>
          </Card>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white p-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-poppins-bold text-lg text-textPrimary">
                {editingContact ? "Kontakt bearbeiten" : "Kontakt hinzufügen"}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={22} color="#1A1A2E" />
              </Pressable>
            </View>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Telefonnummer"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  error={errors.phone?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="relationship"
              render={({ field: { onChange, value } }) => (
                <Input label="Beziehung (optional)" value={value} onChangeText={onChange} />
              )}
            />

            <Button label="Speichern" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};
