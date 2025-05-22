
import supabase from '../config/db.js';
class Todo {
  static async getAll() {
    const { data, error } = await supabase
      .from('Todo')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async create(todoData) {
    const { data, error } = await supabase
      .from('Todo') // Note: 'todo' vs 'todos' — ensure this matches your Supabase table name
      .insert([todoData])
      .select();
  
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  
    return data[0];
  }

  static async update(id, todoData) {
    const { data, error } = await supabase
      .from('Todo')
      .update({ ...todoData, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from('Todo')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

export default Todo;


