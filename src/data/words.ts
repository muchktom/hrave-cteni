export const CZECH_ALPHABET = [
  'A', 'Á', 'B', 'C', 'Č', 'D', 'Ď', 'E', 'É', 'Ě', 'F', 'G', 'H', 'CH', 
  'I', 'Í', 'J', 'K', 'L', 'M', 'N', 'Ň', 'O', 'Ó', 'P', 'Q', 'R', 'Ř', 
  'S', 'Š', 'T', 'Ť', 'U', 'Ú', 'Ů', 'V', 'W', 'X', 'Y', 'Ý', 'Z', 'Ž'
];

export type WordCategory = 'noun' | 'adjective' | 'verb' | 'conjunction';

export interface WordEntry {
  text: string;
  category: WordCategory;
}

const NOUNS: string[] = [
  // Jednoslabičná
  "Pes", "Les", "Nos", "Oko", "Ucho", "Dům", "Hrad", "Lev", "Had", "Vlas", 
  "Zub", "Stůl", "Pán", "Sůl", "Med", "Led", "Sníh", "Květ", "List", "Strom", 
  "Myš", "Sýr", "Vlk", "Klíč", "Mrak", "Hlas", "Kluk", "Kůň", "Míč", "Zeď", 
  "Vůz", "Keř", "Prst", "Krk", "Hroch", "Plot", "Kruh", "Plech", "Stan", "Drát",

  // Dvouslabičná
  "Máma", "Táta", "Bába", "Děda", "Auto", "Kolo", "Noha", "Ruka", "Paní", 
  "Koza", "Ovce", "Král", "Lampa", "Ryba", "Sova", "Růže", "Víla", "Dveře", 
  "Okno", "Mýdlo", "Písek", "Maso", "Voda", "Zima", "Léto", "Pole", "Louka", 
  "Řeka", "Hora", "Kniha", "Taška", "Škola", "Tužka", "Guma", "Papír", 
  "Mrkev", "Hruška", "Jablko", "Švestka", "Kotě", "Štěně", "Kuře", "Zajíci",
  "Jelen", "Srna", "Liška", "Medvěd", "Zebra", "Tygr", "Opice", "Husa",
  "Kachna", "Krůta", "Slepice", "Kohout", "Talíř", "Hrnek", "Lžíce", "Vidlička",

  // Tříslabičná
  "Babička", "Dědeček", "Autobus", "Kalhoty", "Košile", "Rukavice", "Čepice", 
  "Květina", "Zahrada", "Ohrada", "Veverka", "Opravář", "Kuchařka", "Učitel", 
  "Lékařka", "Nemocnice", "Počítač", "Telefon", "Kytara", "Housle", "Piano",
  "Bubínek", "Písnička", "Pohádka", "Princezna", "Čaroděj", "Královna", "Beruška",
  "Motýlek", "Sluníčko", "Měsíček", "Hvězdička", "Autíčko", "Vláček", "Letadlo",
  "Jahoda", "Malina", "Borůvka", "Brambory", "Okurka", "Rajče", "Paprika", 
  "Cibule", "Česnek", "Banány", "Citrony", "Pomeranč", "Ananas", "Zmrzlina",
  "Čokoláda", "Bonbony", "Sušenka", "Lízátko", "Pastelky", "Ořezávátko",
  "Aktovka", "Tabule", "Svačina", "Večeře", "Snídaně", "Postýlka", "Polštář"
];

const ADJECTIVES: string[] = [
  // Jednoduchá přídavná jména
  "Malý", "Velký", "Hodný", "Zlý", "Milý", "Starý", "Mladý", 
  "Bílý", "Černý", "Modrý", "Zelený", "Žlutý", "Rudý", "Hnědý",
  "Hezký", "Pěkný", "Dobrý", "Slaný", "Sladký", "Kyselý",
  "Chytrý", "Hloupý", "Dlouhý", "Krátký", "Veselý", "Smutný",
  "Nový", "Čistý", "Silný", "Slabý", "Teplý", "Studený",
  "Hladký", "Hrubý", "Měkký", "Tvrdý", "Suchý", "Mokrý",
  "Levný", "Drahý", "Plný", "Prázdný", "Rychlý", "Pomalý",
  "Zdravý", "Nemocný", "Těžký", "Lehký", "Tichý", "Hlasitý",
  "Vysoký", "Nízký", "Široký", "Úzký", "Rovný", "Křivý",
  "Zlatý", "Stříbrný", "Chutný", "Hravý", "Světlý", "Tmavý"
];

const VERBS: string[] = [
  "Běží", "Sedí", "Leží", "Skáče", "Plave", "Letí", "Jede",
  "Spí", "Jí", "Pije", "Kreslí", "Píše", "Čte", "Hraje",
  "Volá", "Mluví", "Slyší", "Vidí", "Cítí", "Vaří", "Peče",
  "Myje", "Čistí", "Zpívá", "Tančí", "Pláče", "Směje",
  "Stojí", "Hledá", "Najde", "Ztratí", "Koupí", "Prodá"
];

const CONJUNCTIONS: string[] = [
  "A", "I", "Ale", "Nebo", "Když", "Že", "Aby", "Protože", 
  "Kdyby", "Jako", "Ani", "Jenže", "Ačkoliv", "Dokud", 
  "Než", "Však", "Tedy", "Tudíž"
];

export const ALL_WORDS: WordEntry[] = [
  ...NOUNS.map(text => ({ text, category: 'noun' as WordCategory })),
  ...ADJECTIVES.map(text => ({ text, category: 'adjective' as WordCategory })),
  ...VERBS.map(text => ({ text, category: 'verb' as WordCategory })),
  ...CONJUNCTIONS.map(text => ({ text, category: 'conjunction' as WordCategory })),
];

// Helper to filter words based on available letters and categories
export function getAvailableWords(allowedLetters: string[], allowedCategories: WordCategory[] = ['noun', 'adjective']): string[] {
  const allowedSet = new Set(allowedLetters.map(l => l.toUpperCase()));
  const allowedCategoriesSet = new Set(allowedCategories);
  
  return ALL_WORDS
    .filter(entry => allowedCategoriesSet.has(entry.category))
    .filter(entry => {
      const upperWord = entry.text.toUpperCase();
      for (let i = 0; i < upperWord.length; i++) {
          const char = upperWord[i];
          const nextChar = upperWord[i+1];
          
          if (char === 'C' && nextChar === 'H') {
              // It's a CH. Check if CH is allowed.
              if (allowedSet.has('CH')) {
                  i++; // Skip H
                  continue;
              }
          }
          
          if (!allowedSet.has(char)) {
              return false;
          }
      }
      return true;
    })
    .map(entry => entry.text);
}
