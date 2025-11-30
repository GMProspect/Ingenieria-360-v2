import React, { useEffect, useState } from 'react';
import { Clock, ArrowUpRight, LineChart, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import { Link } from 'react-router-dom';


export default RecentHistory;
