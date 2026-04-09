import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface AboutScreenProps {
  onClose: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onClose }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image 
          source={require('../assets/task-app-banner.png')} 
          style={styles.logo}
        />

        {/* Título */}
        <Text style={styles.title}>Gerenciador de Tarefas</Text>

        {/* Descrição */}
        <Text style={styles.description}>
          O Gerenciador de Tarefas é uma aplicação móvel moderna desenvolvida para ajudar você a organizar e acompanhar suas atividades diárias de forma eficiente. Com uma interface intuitiva e funcionalidades poderosas, você pode criar, editar, excluir e filtrar tarefas com facilidade.
        </Text>

        <Text style={styles.description}>
          A aplicação oferece suporte a datas limite, permitindo que você saiba exatamente quando cada tarefa deve ser concluída. O sistema de cores inteligente destaca tarefas vencidas em vermelho e tarefas no prazo em verde, garantindo que você nunca perca um prazo importante. Além disso, você pode marcar tarefas como concluídas para acompanhar seu progresso.
        </Text>

        <Text style={styles.description}>
          Com recursos de filtro avançados, você pode visualizar todas as suas tarefas, apenas as concluídas ou apenas as pendentes. Isso torna mais fácil focar no que precisa ser feito e celebrar o que já foi realizado. A aplicação foi projetada com o usuário em mente, oferecendo uma experiência suave e responsiva em todos os dispositivos.
        </Text>

        {/* Tecnologias */}
        <Text style={styles.sectionTitle}>Tecnologias Utilizadas</Text>
        <View style={styles.technologiesList}>
          <View style={styles.technologyItem}>
            <Text style={styles.technologyName}>React Native</Text>
            <Text style={styles.technologyDesc}>Framework para desenvolvimento de aplicações móveis</Text>
          </View>
          <View style={styles.technologyItem}>
            <Text style={styles.technologyName}>Expo</Text>
            <Text style={styles.technologyDesc}>Plataforma para desenvolvimento e deploy de aplicações React Native</Text>
          </View>
          <View style={styles.technologyItem}>
            <Text style={styles.technologyName}>TypeScript</Text>
            <Text style={styles.technologyDesc}>Linguagem de programação com tipagem estática</Text>
          </View>
          <View style={styles.technologyItem}>
            <Text style={styles.technologyName}>EAS</Text>
            <Text style={styles.technologyDesc}>Expo Application Services para build e deploy</Text>
          </View>
        </View>

        {/* Botão Fechar */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 24,
    marginBottom: 16,
  },
  technologiesList: {
    marginBottom: 24,
  },
  technologyItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#000',
  },
  technologyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  technologyDesc: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 24,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AboutScreen;
