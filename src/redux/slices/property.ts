import { createAsyncThunk } from '@reduxjs/toolkit';
import { api_urls } from '../../utilities';
import {
  deleteService,
  getService,
  patchFormDataService,
  postFormDataService,
  postService,
} from '../services';
import { RootState } from '../store';

function parseFavoritesPayload(response: {
  data?: Record<string, unknown>;
}): Record<string, unknown>[] {
  const body = response?.data as Record<string, unknown> | undefined;
  const raw =
    body?.data !== undefined && body?.data !== null ? body.data : body;
  let rows: unknown[] = [];
  if (Array.isArray(raw)) {
    rows = raw;
  } else if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.results)) {
      rows = o.results as unknown[];
    } else if (Array.isArray(o.favorites)) {
      rows = o.favorites as unknown[];
    }
  }
  return rows
    .map(row => {
      if (row && typeof row === 'object' && 'property' in row) {
        return (row as { property: Record<string, unknown> }).property;
      }
      return row as Record<string, unknown>;
    })
    .filter(p => p && typeof p === 'object' && p.id != null);
}

/** GET /api/v1/favorites/ — returns raw property-like objects. */
export const fetchMyFavorites = createAsyncThunk(
  'property/fetchMyFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getService(api_urls.favoritesList);
      return parseFavoritesPayload(response);
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);

/**
 * POST /api/v1/favorites/{property_id}/ — toggle favorite (no JSON body; id in path).
 */
export const toggleFavoriteProperty = createAsyncThunk(
  'property/toggleFavoriteProperty',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const res = await postService(api_urls.favoriteToggle(propertyId), {});
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);

export const fetchPropertyDetail = createAsyncThunk(
  'property/fetchPropertyDetail',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const response = await getService(api_urls.propertyDetail(propertyId));
      const body = response?.data as Record<string, unknown> | undefined;
      const raw =
        body?.data !== undefined && body?.data !== null ? body.data : body;
      return (raw ?? {}) as Record<string, unknown>;
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);

/** GET /api/v1/properties/all/ — full list (for Home, etc.). */
export const fetchAllProperties = createAsyncThunk(
  'property/fetchAllProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getService(api_urls.propertyListAll);
      const body = response?.data as Record<string, unknown> | undefined;
      const envelope = (body?.data ?? body) as Record<string, unknown> | undefined;
      const results = Array.isArray(envelope?.results)
        ? (envelope.results as unknown[])
        : Array.isArray(envelope)
          ? (envelope as unknown[])
          : [];
      return results as Record<string, unknown>[];
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);

export const fetchMyListedProperties = createAsyncThunk(
  'property/fetchMyListedProperties',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = (getState() as RootState).auth.userInfo.id;
      if (!userId) {
        return [];
      }
      const response = await getService(api_urls.propertyListAll);
      const body = response?.data as Record<string, unknown> | undefined;
      const envelope = (body?.data ?? body) as Record<string, unknown> | undefined;
      const results = Array.isArray(envelope?.results)
        ? (envelope.results as unknown[])
        : Array.isArray(envelope)
          ? (envelope as unknown[])
          : [];
      return results.filter(
        (p: any) => String(p?.owner?.id ?? '') === String(userId),
      );
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const res = await patchFormDataService(
        api_urls.propertyUpdate(id),
        formData,
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const res = await deleteService(api_urls.propertyDelete(propertyId));
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await postFormDataService(
        api_urls.propertyCreate,
        formData,
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.data ?? err?.response?.data ?? err);
    }
  },
);
