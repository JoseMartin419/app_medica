import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

// Reutilizamos la lógica y las frases que ya tenías
const frases = [
    "La única forma de hacer un gran trabajo es amar lo que haces. - Steve Jobs",
    "Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito. - Aristóteles",
    "El futuro pertenece a quienes creen en la belleza de sus sueños. - Eleanor Roosevelt",
    "Lo que no me mata, me fortalece. - Friedrich Nietzsche",
    "La vida es un 10% lo que te sucede y un 90% cómo reaccionas a ello. - Charles R. Swindoll",
    "Solo sé que no sé nada. - Sócrates",
    "Un viaje de mil millas comienza con un solo paso. - Lao Tse",
    "La felicidad de tu vida depende de la calidad de tus pensamientos. - Marco Aurelio",
    "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora. - Proverbio Chino",
    "No son las cosas que nos pasan las que nos perturban, sino nuestras opiniones sobre ellas. - Epicteto",
    "Sé tú mismo, los demás puestos ya están ocupados. - Oscar Wilde",
    "La imaginación es más importante que el conocimiento. - Albert Einstein",
    "El que lee mucho y anda mucho, ve mucho y sabe mucho. - Miguel de Cervantes",
    "Pienso, luego existo. - René Descartes",
    "La disciplina es el puente entre las metas y los logros.",
    "No cuentes los días, haz que los días cuenten. - Muhammad Ali",
    "La vida no es la que uno vivió, sino la que uno recuerda y cómo la recuerda para contarla. - Gabriel García Márquez",
    "Lo esencial es invisible a los ojos. - Antoine de Saint-Exupéry",
    "Cae siete veces, levántate ocho. - Proverbio Japonés",
    "El propósito de la vida es una vida con propósito. - Robert Byrne",
    "La simplicidad es la máxima sofisticación. - Leonardo da Vinci",
    "Una vida sin examen no merece ser vivida. - Sócrates",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "La duda es uno de los nombres de la inteligencia. - Jorge Luis Borges",
    "No esperes. El momento nunca será el 'justo'.",
    "La creatividad es la inteligencia divirtiéndose. - Albert Einstein",
    "Todo lo que puedes imaginar es real. - Pablo Picasso",
    "La paciencia no es la habilidad de esperar, sino la habilidad de mantener una buena actitud mientras esperas.",
    "La mente es como un paracaídas, solo funciona si se abre.",
    "El arte de vencer se aprende en las derrotas. - Simón Bolívar",
    "La fortuna favorece a los valientes. - Virgilio",
    "Si quieres el arcoíris, tienes que aguantar la lluvia. - Dolly Parton",
    "La música es para el alma lo que la gimnasia para el cuerpo. - Platón",
    "El conocimiento habla, pero la sabiduría escucha. - Jimi Hendrix",
    "Un hombre que no se alimenta de sus sueños envejece pronto. - William Shakespeare",
    "La vida es realmente simple, pero insistimos en hacerla complicada. - Confucio",
    "La mejor venganza es un éxito masivo. - Frank Sinatra",
    "El obstáculo es el camino. - Proverbio Zen",
    "La única discapacidad en la vida es una mala actitud.",
    "Hablar es el arte de sofocar e interrumpir el pensamiento. - Thomas Carlyle",
    "El hombre es la medida de todas las cosas. - Protágoras",
    "La adversidad revela al genio, la prosperidad lo oculta. - Horacio",
    "La acción es la clave fundamental de todo éxito.",
    "Nada en la vida debe ser temido, solo comprendido. - Marie Curie",
    "Conócete a ti mismo. - Oráculo de Delfos",
    "El que tiene un porqué para vivir puede soportar casi cualquier cómo. - Friedrich Nietzsche",
    "La belleza comienza en el momento en que decides ser tú misma. - Coco Chanel",
    "Para ser irremplazable, uno siempre debe ser diferente. - Coco Chanel",
    "El éxito no es definitivo, el fracaso no es fatal: es el coraje para continuar lo que cuenta. - Winston Churchill",
    "La mente lo es todo. En lo que piensas te conviertes. - Buda",
    "No juzgues cada día por la cosecha que recoges, sino por las semillas que plantas. - Robert Louis Stevenson",
    "Tu tiempo es limitado, no lo malgastes viviendo la vida de otra persona. - Steve Jobs",
    "El único lugar donde el éxito viene antes que el trabajo es en el diccionario.",
    "La lógica te llevará de A a B. La imaginación te llevará a todas partes. - Albert Einstein",
    "No se puede encontrar la paz evitando la vida. - Virginia Woolf",
    "La vida se encoge o se expande en proporción al coraje de uno. - Anaïs Nin",
    "Si la oportunidad no llama, construye una puerta. - Milton Berle",
    "Transforma tus heridas en sabiduría. - Oprah Winfrey",
    "El primer paso es el más importante. Es el que te saca de tu zona de confort.",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo. - Nelson Mandela",
    "La manera de empezar es dejar de hablar y empezar a hacer. - Walt Disney",
    "Los locos que piensan que pueden cambiar el mundo son los que lo hacen. - Rob Siltanen",
    "Somos del mismo material del que se tejen los sueños. - William Shakespeare",
    "Un barco en el puerto está seguro, pero para eso no se construyen los barcos. - John A. Shedd",
    "El secreto de la existencia humana no solo está en vivir, sino también en saber para qué se vive. - Fiódor Dostoyevski",
    "El dolor es inevitable, el sufrimiento es opcional. - Haruki Murakami",
    "Incluso la noche más oscura terminará y el sol saldrá. - Victor Hugo",
    "La vida es una obra de teatro que no permite ensayos. - Charles Chaplin",
    "Si he visto más lejos, es porque me he subido a hombros de gigantes. - Isaac Newton",
    "La libertad consiste en ser dueño de la propia vida. - Platón",
    "Aquel que teme al sufrimiento, ya sufre el temor. - Proverbio Chino",
    "No hay viento favorable para el que no sabe a qué puerto se dirige. - Séneca",
    "El que puede cambiar sus pensamientos puede cambiar su destino.",
    "La felicidad no es algo hecho. Proviene de tus propias acciones. - Dalai Lama",
    "Elige un trabajo que te guste y no tendrás que trabajar ni un día de tu vida. - Confucio",
    "El fracaso es simplemente la oportunidad de empezar de nuevo, esta vez de forma más inteligente. - Henry Ford",
    "Nuestra mayor gloria no está en no caer nunca, sino en levantarnos cada vez que caemos. - Confucio",
    "El carácter es la más importante de todas las virtudes, porque sin coraje no se puede practicar ninguna otra virtud consistentemente.",
    "La verdadera sabiduría está en reconocer la propia ignorancia. - Sócrates",
    "El que conquista a otros es fuerte; el que se conquista a sí mismo es poderoso. - Lao Tse",
    "El secreto para salir adelante es empezar.",
    "Los límites de mi lenguaje son los límites de mi mundo. - Ludwig Wittgenstein",
    "La experiencia no es lo que te sucede, sino lo que haces con lo que te sucede. - Aldous Huxley",
    "La vida es un eco; lo que envías, regresa.",
    "No te conformes con lo que necesitas, lucha por lo que te mereces.",
    "La calidad nunca es un accidente; siempre es el resultado de un esfuerzo de la inteligencia. - John Ruskin",
    "La mejor forma de predecir el futuro es crearlo. - Peter Drucker",
    "La vida es el arte de dibujar sin una goma de borrar. - John W. Gardner",
    "Hazlo y ten miedo. El miedo se pasa, la satisfacción queda.",
    "La única fuente de conocimiento es la experiencia. - Albert Einstein",
    "La vida es como una bicicleta, para mantener el equilibrio tienes que seguir moviéndote. - Albert Einstein",
    "Todo el mundo es un genio. Pero si juzgas a un pez por su habilidad para trepar un árbol, vivirá toda su vida creyendo que es estúpido. - Albert Einstein",
    "La vida es una pregunta y cómo la vivimos es nuestra respuesta.",
    "El hombre que mueve una montaña comienza cargando pequeñas piedras. - Confucio",
    "La acción es el antídoto contra la desesperación. - Joan Baez",
    "El momento en que dudas si puedes volar, cesas para siempre de poder hacerlo. - J.M. Barrie",
    "No puedes cruzar el mar simplemente mirando el agua. - Rabindranath Tagore",
    "El éxito es caer nueve veces y levantarse diez. - Jon Bon Jovi",
    "La envidia es una declaración de inferioridad. - Napoleón Bonaparte",
    "No tengas miedo de la perfección, nunca la alcanzarás. - Salvador Dalí",
    "El que no está ocupado naciendo, está ocupado muriendo. - Bob Dylan",
    "El coraje es la resistencia al miedo, el dominio del miedo, no la ausencia de miedo. - Mark Twain",
    "Lo que las orugas llaman el fin del mundo, el maestro lo llama mariposa. - Richard Bach",
    "La vida es demasiado importante como para tomarla en serio. - Oscar Wilde",
    "No vivas para que tu presencia se note, sino para que tu ausencia se sienta. - Bob Marley",
    "La felicidad se puede hallar hasta en los más oscuros momentos, si somos capaces de usar bien la luz. - J.K. Rowling",
    "El universo no conspira contra ti, pero tampoco se desvía para alinear tus pines. - John Green",
    "Las estrellas no pueden brillar sin oscuridad.",
    "La única cosa que se interpone entre tú y tu sueño es la voluntad de intentarlo y la creencia de que es posible. - Joel Brown",
    "Los pequeños actos de bondad y amor son los que hacen la vida más grande.",
    "Un día sin risa es un día perdido. - Charles Chaplin",
    "El cambio es la ley de la vida. Y aquellos que solo miran al pasado o al presente, seguramente se perderán el futuro. - John F. Kennedy",
    "La mente es un espejo flexible, ajústalo para ver un mundo mejor.",
    "Sé la energía que quieres atraer.",
    "La gratitud convierte lo que tenemos en suficiente.",
    "No dejes que el ayer ocupe demasiado del hoy.",
    "Cree que puedes y ya estás a medio camino. - Theodore Roosevelt",
    "Las dificultades preparan a personas comunes para destinos extraordinarios. - C.S. Lewis",
    "Si no te gusta algo, cámbialo. Si no puedes cambiarlo, cambia tu actitud. - Maya Angelou",
    "La vida no se mide por las veces que respiras, sino por los momentos que te dejan sin aliento.",
    "Apunta a la luna. Si fallas, podrías darle a una estrella. - W. Clement Stone",
    "La excelencia es hacer cosas comunes de manera extraordinaria. - George Washington Carver",
    "La fe es dar el primer paso incluso cuando no ves toda la escalera. - Martin Luther King Jr.",
  
  ];

export default function WidgetBienestarFlotante() {
  const [frase, setFrase] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const diaDelMes = new Date().getDate();
    const index = diaDelMes % frases.length;
    setFrase(frases[index]);
  }, []);

  // Variantes para la animación de la frase
  const fraseVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.3, ease: "easeOut" } },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: "easeIn" } },
  };

  return (
    // Contenedor fijo en la esquina inferior derecha
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
      
      {/* La frase, que aparece y desaparece con animación */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fraseVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-xl p-4 shadow-2xl border border-gray-100 max-w-xs"
          >
            <p className="text-gray-800 font-medium italic">“{frase}”</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* La esfera (botón) con el icono */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'sparkles'}
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="text-white" size={28} /> : <Sparkles className="text-white" size={28} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

    </div>
  );
}