import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const [listaJogos, setListaJogos] = useState([]);
  const [jogosFiltrados, setJogosFiltrados] = useState([]);

  const [carregando, setCarregando] = useState(true);

  const [pesquisa, setPesquisa] = useState('');

  const [notas, setNotas] = useState({});
  const [comentarios, setComentarios] = useState({});

  useEffect(() => {
    pegarJogos();
  }, []);

  async function pegarJogos() {
    try {
      const resposta = await fetch(
        'https://www.freetogame.com/api/games'
      );

      const dados = await resposta.json();

      setListaJogos(dados);
      setJogosFiltrados(dados);
    } catch (erro) {
      console.log(erro);
    }

    setCarregando(false);
  }

  function pesquisarJogo(texto: string) {
    setPesquisa(texto);

    const jogos = listaJogos.filter((jogo: any) => {
      return jogo.title
        .toLowerCase()
        .includes(texto.toLowerCase());
    });

    setJogosFiltrados(jogos);
  }

  function darNota(id: number, estrela: number) {
    setNotas({
      ...notas,
      [id]: estrela,
    });
  }

  function salvarComentario(id: number, texto: string) {
    setComentarios({
      ...comentarios,
      [id]: texto,
    });
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="black" />

        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        GameRate
      </Text>

      <TextInput
        placeholder="Pesquisar jogo"
        value={pesquisa}
        onChangeText={pesquisarJogo}
        style={styles.input}
      />

      <FlatList
        data={jogosFiltrados}
        keyExtractor={(item: any) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.imagem}
            />

            <Text style={styles.nome}>
              {item.title}
            </Text>

            <Text style={styles.texto}>
              Gênero: {item.genre}
            </Text>

            <Text style={styles.texto}>
              Plataforma: {item.platform}
            </Text>

            <View style={styles.estrelas}>
              {[1, 2, 3, 4, 5].map((itemEstrela) => (
                <TouchableOpacity
                  key={itemEstrela}
                  onPress={() =>
                    darNota(item.id, itemEstrela)
                  }
                >
                  <Ionicons
                    name={
                      notas[item.id] >= itemEstrela
                        ? 'star'
                        : 'star-outline'
                    }
                    size={26}
                    color="gold"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Comentário"
              multiline
              value={comentarios[item.id] || ''}
              onChangeText={(texto) =>
                salvarComentario(item.id, texto)
              }
              style={styles.comentario}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },

  imagem: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  texto: {
    marginTop: 4,
  },

  estrelas: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },

  comentario: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});