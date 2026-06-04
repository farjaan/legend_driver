import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandColors } from '@constants/colors';
import { APP_FONTS } from '@constants/appFonts';
import { Spacing } from '@constants/layout';
import type { JobStatus } from '@domain/job.types';
import { useTranslation } from 'react-i18next';

const FLOW: JobStatus[] = [
  'assigned',
  'accepted',
  'en_route',
  'arrived',
  'handover_in_progress',
  'completed',
];

type Props = {
  current: JobStatus;
};

export function JobStatusTimeline({ current }: Props) {
  const { t } = useTranslation();
  const currentIdx = FLOW.indexOf(current);

  return (
    <View style={styles.wrap}>
      {FLOW.map((step, index) => {
        const done = currentIdx >= index && currentIdx >= 0;
        const active = currentIdx === index;
        return (
          <View key={step} style={styles.step}>
            <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]} />
            {index < FLOW.length - 1 ? (
              <View style={[styles.line, done && styles.lineDone]} />
            ) : null}
            <Text
              style={[styles.label, done && styles.labelDone]}
              numberOfLines={1}>
              {t(`jobs.status.${step}`)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(44, 27, 71, 0.15)',
    zIndex: 1,
  },
  dotDone: {
    backgroundColor: BrandColors.accentOrange,
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: BrandColors.accentOrange,
  },
  line: {
    position: 'absolute',
    top: 4,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: 'rgba(44, 27, 71, 0.1)',
    zIndex: 0,
  },
  lineDone: {
    backgroundColor: 'rgba(240, 137, 0, 0.4)',
  },
  label: {
    fontFamily: APP_FONTS.regular,
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 11,
  },
  labelDone: {
    fontFamily: APP_FONTS.bold,
    color: BrandColors.brandDeep,
  },
});
