/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  loadVerbConjugationRules,
  loadGenderArticleRules,
  loadPluralizationRules,
  loadCaseEndingsRules,
  DEFAULT_RULE_PATH,
} from './loader';

describe('loader', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('DEFAULT_RULE_PATH is verb-conjugation path', () => {
    expect(DEFAULT_RULE_PATH).toBe('verb-conjugation/present-en.json');
  });

  it('loadVerbConjugationRules fetches and returns valid rule', async () => {
    const rule = {
      conceptType: 'verb-conjugation',
      language: 'en',
      tense: 'present',
      persons: ['1s', '2s', '3s', '1p', '2p', '3p'],
      items: [
        {
          infinitive: 'talk',
          forms: { '1s': 'talk', '2s': 'talk', '3s': 'talks', '1p': 'talk', '2p': 'talk', '3p': 'talk' },
        },
      ],
    };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => rule,
    });
    const result = await loadVerbConjugationRules('verb-conjugation/present-en.json');
    expect(result).toEqual(rule);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/rules/verb-conjugation/present-en.json'));
  });

  it('loadVerbConjugationRules throws on non-ok response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });
    await expect(loadVerbConjugationRules('verb-conjugation/present-en.json')).rejects.toThrow(
      /Failed to load rules/
    );
  });

  it('loadGenderArticleRules fetches and returns valid rule', async () => {
    const rule = {
      conceptType: 'gender-article',
      language: 'de',
      articleType: 'definite',
      items: [{ noun: 'Mann', article: 'der' }, { noun: 'Frau', article: 'die' }],
    };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => rule,
    });
    const result = await loadGenderArticleRules('gender-article/german-definite.json');
    expect(result).toEqual(rule);
  });

  it('loadPluralizationRules fetches and returns valid rule', async () => {
    const rule = {
      conceptType: 'pluralization',
      language: 'en',
      items: [{ singular: 'cat', plural: 'cats' }, { singular: 'box', plural: 'boxes' }],
    };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => rule,
    });
    const result = await loadPluralizationRules('pluralization/en.json');
    expect(result).toEqual(rule);
  });

  it('loadCaseEndingsRules fetches and returns valid rule', async () => {
    const rule = {
      conceptType: 'case-endings',
      language: 'de',
      contextName: 'dative',
      items: [{ label: 'der', form: 'dem' }, { label: 'die', form: 'der' }],
    };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => rule,
    });
    const result = await loadCaseEndingsRules('case-endings/german-dative.json');
    expect(result).toEqual(rule);
  });
});
