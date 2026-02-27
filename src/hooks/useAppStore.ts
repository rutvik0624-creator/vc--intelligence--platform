import { useLocalStorage } from './useLocalStorage';

export type UserRole = 'admin' | 'analyst';

export interface User {
  email: string;
  role: UserRole;
}

export interface List {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  industry: string;
  stage: string;
  location: string;
  createdAt: number;
}

export function useAppStore() {
  const [user, setUser] = useLocalStorage<User | null>('vc-intel-user', null);
  const [lists, setLists] = useLocalStorage<List[]>('vc-intel-lists', []);
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('vc-intel-saved-searches', []);
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('vc-intel-notes', {});

  const login = (email: string, role: UserRole) => setUser({ email, role });
  const logout = () => setUser(null);

  const addList = (name: string) => {
    const newList: List = {
      id: Math.random().toString(36).substring(7),
      name,
      companyIds: [],
      createdAt: Date.now(),
    };
    setLists([...lists, newList]);
  };

  const deleteList = (id: string) => {
    setLists(lists.filter(l => l.id !== id));
  };

  const addCompanyToList = (listId: string, companyId: string) => {
    setLists(lists.map(l => {
      if (l.id === listId && !l.companyIds.includes(companyId)) {
        return { ...l, companyIds: [...l.companyIds, companyId] };
      }
      return l;
    }));
  };

  const removeCompanyFromList = (listId: string, companyId: string) => {
    setLists(lists.map(l => {
      if (l.id === listId) {
        return { ...l, companyIds: l.companyIds.filter(id => id !== companyId) };
      }
      return l;
    }));
  };

  const saveSearch = (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
    };
    setSavedSearches([...savedSearches, newSearch]);
  };

  const deleteSearch = (id: string) => {
    setSavedSearches(savedSearches.filter(s => s.id !== id));
  };

  const updateNote = (companyId: string, note: string) => {
    setNotes({ ...notes, [companyId]: note });
  };

  return {
    user,
    login,
    logout,
    lists,
    addList,
    deleteList,
    addCompanyToList,
    removeCompanyFromList,
    savedSearches,
    saveSearch,
    deleteSearch,
    notes,
    updateNote,
  };
}
