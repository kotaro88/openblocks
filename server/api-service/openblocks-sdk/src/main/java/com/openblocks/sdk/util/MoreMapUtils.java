package com.openblocks.sdk.util;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * add more methods in addition to {@link org.apache.commons.collections4.MapUtils}
 */
public class MoreMapUtils {

    public static <K, T> List<T> getList(final Map<? super K, ?> map, final K key, final List<T> defaultValue) {
        List<T> answer = getList(map, key);
        if (answer == null) {
            answer = defaultValue;
        }
        return answer;
    }

    @SuppressWarnings("unchecked")
    public static <K, T> List<T> getList(final Map<? super K, ?> map, final K key) {
        if (map != null) {
            final Object answer = map.get(key);
            if (answer instanceof List<?>) {
                return (List<T>) answer;
            }
        }
        return null;
    }

    /**
     * O(n)
     */
    public static boolean containsStringKeyIgnoreCase(Map<?, ?> map, String key) {
        for (Entry<?, ?> entry : map.entrySet()) {
            Object o = entry.getKey();
            if (o instanceof String s && s.equalsIgnoreCase(key)) {
                return true;
            }
        }
        return false;
    }
}
